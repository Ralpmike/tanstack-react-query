import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "./main";

function App() {
  const [post, setPost] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const {
    mutate: addTodoMutation,
    isLoading: isPosting,
    data: postData,
  } = useMutation({
    mutationFn: postTodos,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  console.log(postData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  async function handlePost() {
    if (!post) return;
    try {
      addTodoMutation(post);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <div className="flex gap-4 flex-wrap">
          {data.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </div>
        <button
          onClick={() => refetch()}
          className=" bg-green-400/20 hover:bg-green-400 p-4 my-4
        "
        >
          Re-fetch
        </button>
      </div>

      <div className="flex items-center justify-center flex-col gap-3">
        <p>Enter a new Post</p>
        <input
          type="text"
          name="post"
          onChange={(e) => setPost(e.target.value)}
          className="border"
        />
        <button
          type="submit"
          className="bg-green-400 px-4"
          onClick={handlePost}
          disabled={isPosting}
        >
          Submit
        </button>
      </div>
    </>
  );
}

const getTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const data = await response.json();

  return data;
};

const postTodos = async (post) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: post,
      completed: false,
      userId: 1,
    }),
  });
  const data = await response.json();

  console.log("added todo", data);

  return data;
};

const Todo = ({ todo }) => {
  const { title, completed } = todo;
  return (
    <div className="border">
      <p>{title}</p>
      <i>{completed}</i>
    </div>
  );
};

export default App;
