import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment } from "../../apis/api";
import CommentElement from "./CommentElement";
import { getCookie } from "../../utils/cookie";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  const handleCommentSubmit = (callback) => (e) => {
    e.preventDefault();
    if (getCookie("access_token")) {
      const createCommentAPI = async (data) => {
        const res = await createComment(data);
        if (res.status === 201) callback([...commentList, res.data]);
        else window.alert("댓글 등록 중 에러 발생");
      };

      createCommentAPI({
        post: postId,
        content: newContent,
      });
      setNewContent("");
    }
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      const deleteCommentAPI = async (commentId) => {
        const res = await deleteComment(commentId);
        if (res)
          setCommentList(
            commentList.filter((comment) => comment.id !== commentId)
          );
        else window.alert("댓글 삭제 중 에러 발생");
      };
      deleteCommentAPI(commentId);
    }
  };

  useEffect(() => {
    const getCommentAPI = async (postId) => {
      const res = await getComments(postId);

      if (res.status === 200) setCommentList(res.data);
      else window.alert("댓글 불러오기 중 에러 발생");
    };
    getCommentAPI(postId);
  }, [postId]);

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>
      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={handleCommentDelete}
            postId={postId}
          />
        );
      })}

      <form
        className="flex flex-row mt-10 gap-3"
        onSubmit={handleCommentSubmit(setCommentList)}
      >
        <input
          type="text"
          value={newContent}
          placeholder="댓글을 입력해주세요"
          className="input"
          style={{ width: "calc(100% - 100px)" }}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit" className="button">
          작성
        </button>
      </form>
    </div>
  );
};

export default Comment;
