import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, get, push, set, update } from "firebase/database";

const Forum = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({
    userid: user.id,
    username: user.username,
    text: "",
    comments: [],
  });
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState({}); // Track visibility of comments for each post

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const loadPosts = async () => {
    const dbRef = ref(db, "posts");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const posts = snapshot.val();

      const tempPosts = Object.keys(posts).map((id) => {
        return {
          ...posts[id],
          id,
        };
      });

      setPosts(tempPosts.length > 0 ? tempPosts : []);
    } else {
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();

    try {
      const newDocRef = push(ref(db, "posts"));
      await set(newDocRef, post);

      await loadPosts();

      setPost({
        userid: user.id,
        username: user.username,
        text: "",
        comments: [],
      });
    } catch (error) {
      console.log("Cannot create post");
    }
  };

  const handleAddComment = async (postId) => {
    if (newComment.trim() === "") return;

    try {
      let currComments = posts.find((p) => p.id === postId).comments;
      if (!currComments) currComments = [];
      const updatedComments = [
        ...currComments,
        { userid: user.id, name: user.username, text: newComment },
      ];

      await set(ref(db, `posts/${postId}`), {
        ...{ ...posts.filter((p) => p.id === postId)[0] },
        comments: updatedComments,
      });

      setNewComment(""); // Clear input field after comment submission
      loadPosts(); // Reload posts to reflect new comment
    } catch (error) {}
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="mb-4 p-3 mt-3 create-post">
            <Form onSubmit={createPost}>
              <Row>
                <Col md={9}>
                  <FormControl
                    type="text"
                    placeholder="Create a Post..."
                    className="mr-sm-2"
                    value={post.text}
                    onChange={(e) => setPost({ ...post, text: e.target.value })}
                  />
                </Col>
                <Col md={3}>
                  <Button
                    variant="primary"
                    className="ms-2 w-100"
                    type="submit"
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>

          {posts?.length > 0 &&
            posts.map((post, index) => (
              <Card className="mb-3 posts" key={index}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-user-circle fa-2x"></i>
                    <Card.Title
                      className="mb-0 ms-2"
                      onClick={() => handleUserClick(post.userid)}
                      style={{ cursor: "pointer" }}
                    >
                      {post.username}
                    </Card.Title>
                  </div>
                  <Card.Text>{post.text}</Card.Text>
                  <Card.Footer>
                    <i className="fas fa-comments"></i>
                    {post?.comments ? post.comments.length : 0}
                    Comment{post?.comments && post.comments.length !== 1 && "s"}
                    <Button
                      variant="link"
                      onClick={() => toggleComments(post.id)}
                      className="ms-2"
                    >
                      {showComments[post.id] ? "Hide" : "Show"} Comments
                    </Button>
                  </Card.Footer>

                  {showComments[post.id] && (
                    <div className="comments-section mt-3">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }}
                        className="d-flex"
                      >
                        <FormControl
                          type="text"
                          placeholder="Add a comment..."
                          className="mt-2 me-2"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          type="submit"
                          className="mt-2"
                        >
                          Comment
                        </Button>
                      </Form>

                      {post?.comments &&
                        post.comments.map((comment, idx) => (
                          <div key={idx} className="my-2">
                            <i className="fas fa-user-circle me-2"></i>
                            <span className="me-4">
                              <b>{comment.name}</b>
                            </span>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Forum;
