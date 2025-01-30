import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";

const Post = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [featureImg, setFeatureImg] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/get-csrf-token`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.error("CSRF token missing from server response.");
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCSRFToken();
  }, [baseUrl]);

  const handleTagsChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  const handleImageChange = (e, setState) => {
    setState(e.target.value.split(",").map((url) => url.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uid = sessionStorage.getItem("uid");
    const displayName = sessionStorage.getItem("displayName");

    if (!uid || !displayName) {
      setError("You need to be logged in to create a post.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    formData.append("category", category);
    formData.append("featureImg", featureImg);
    additionalImages.forEach((image) =>
      formData.append("additionalImages", image)
    );

    formData.append("uid", uid);
    formData.append("displayName", displayName);

    try {
      const response = await fetch(`${baseUrl}/api/posts/create`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setError("");
        setTitle("");
        setBody("");
        setTags([]);
        setCategory("");
        setFeatureImg("");
        setAdditionalImages([]);
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to create post");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-container">
      <h2>Create a New Post</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Body Input */}
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        {/* Tags Input */}
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          value={tags.join(", ")}
          onChange={handleTagsChange}
        />

        {/* Category Dropdown */}
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Coins">Coins</option>
          <option value="Tech">Tech</option>
          <option value="Business">Business</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="Web3">Web3</option>
        </select>

        {/* Feature Image URL */}
        <label htmlFor="featureImg">Feature Image URL</label>
        <input
          type="url"
          id="featureImg"
          value={featureImg}
          onChange={(e) => setFeatureImg(e.target.value)}
          required
        />

        {/* Additional Images URLs */}
        <label htmlFor="additionalImages">
          Additional Images URLs (comma separated)
        </label>
        <input
          type="text"
          id="additionalImages"
          value={additionalImages.join(", ")}
          onChange={(e) => handleImageChange(e, setAdditionalImages)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default Post;
