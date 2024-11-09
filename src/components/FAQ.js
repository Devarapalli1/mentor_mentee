import { push, ref, set, update } from "firebase/database";
import React, { useState } from "react";
import { Container, Accordion, Form, Button, Alert } from "react-bootstrap";
import { db } from "../firebase/config";

const FAQ = ({ user, faqs, setFaqs, loadFAQ }) => {
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newFaq.question) {
      setError("Question is required");
      return;
    }

    if (editingIndex !== null) {
      const faqRef = ref(db, "faq/" + newFaq.id);
      await set(faqRef, {
        question: newFaq.question,
        answer: newFaq.answer,
      });

      setFaqs((prevFaqs) =>
        prevFaqs.map((faq, index) => (index === editingIndex ? newFaq : faq))
      );
      setEditingIndex(null);
    } else {
      const faqRef = push(ref(db, "faq"));
      await set(faqRef, {
        question: newFaq.question,
        answer: newFaq.answer,
      });

      setFaqs((prevFaqs) => [...prevFaqs, newFaq]);
    }
    setNewFaq({ question: "", answer: "" });
    setError("");
  };

  const handleAnswerSubmit = async (index, answer) => {
    const faq = faqs[index];
    const faqRef = ref(db, "faq/" + faq.id);

    // Update the answer in Firebase and state
    await update(faqRef, { answer });
    setFaqs((prevFaqs) =>
      prevFaqs.map((f, i) => (i === index ? { ...f, answer } : f))
    );
  };

  const handleEdit = (index) => {
    const faqToEdit = faqs[index];
    setNewFaq(faqToEdit);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewFaq({ question: "", answer: "" });
  };

  loadFAQ();

  return (
    <Container className="p-5 faq">
      <h2 className="mb-4">Frequently Asked Questions</h2>

      <div className="bg-white p-5 py-3 shadow mb-5">
        <h3 className="mt-4">
          {editingIndex !== null ? "Edit FAQ" : "Add New FAQ"}
        </h3>
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formNewQuestion" className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              name="question"
              value={newFaq.question}
              onChange={handleChange}
              placeholder="Enter your question"
              required
              disabled={editingIndex !== null}
            />
          </Form.Group>

          <Form.Group controlId="formNewAnswer" className="mb-3">
            <Form.Label>Answer</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer"
              value={newFaq.answer}
              onChange={handleChange}
              placeholder="Enter your answer"
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button className="bg-primary w-50" type="submit">
              {editingIndex !== null ? "Update FAQ" : "Post FAQ"}
            </Button>
            {editingIndex !== null && (
              <Button
                variant="danger"
                onClick={handleCancelEdit}
                className="ms-2 w-50 border-0"
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </div>

      <Accordion>
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header className="d-flex justify-content-between">
              {faq.question}{" "}
              {user.role === "admin" && (
                <Button variant="link" onClick={() => handleEdit(index)}>
                  <i className="fa-regular fa-pen-to-square secondary-color"></i>
                </Button>
              )}
            </Accordion.Header>
            <Accordion.Body className="ps-5">
              {faq.answer ? (
                <div>{faq.answer}</div>
              ) : (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAnswerSubmit(index, e.target.answer.value);
                  }}
                >
                  <Form.Group
                    controlId={`formAnswer-${index}`}
                    className="mb-3"
                  >
                    <Form.Label>Provide an Answer</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="answer"
                      placeholder="Enter your answer"
                      required
                    />
                  </Form.Group>
                  <Button type="submit">Submit Answer</Button>
                </Form>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default FAQ;
