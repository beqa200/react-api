import {
  useEffect,
  useState,
} from "react";
import "./App.css";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] =
    useState<
      Post[] | undefined
    >(undefined);

  const [
    editPostId,
    setEditPostId,
  ] = useState<
    number | undefined
  >();

  const [
    editPostData,
    seEditPostData,
  ] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);
  const [
    formData,
    setFormData,
  ] = useState({
    title: "",
    body: "",
  });

  const fetchPosts =
    async () => {
      const response =
        await axios.get(
          "http://localhost:3000/posts"
        );
      const data =
        response.data;
      setPosts(data);
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleDelete = async (
    id: number
  ) => {
    const response =
      await axios.delete(
        `http://localhost:3000/posts/${id}`
      );
    console.log(
      response.status
    );
    if (
      response.status === 200
    ) {
      setPosts(
        posts?.filter(
          (post) =>
            post.id !== id
        )
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const response =
      await axios.post(
        "http://localhost:3000/posts",
        formData
      );
    if (
      response.status === 201
    ) {
      setPosts([
        ...(posts || []),
        response.data,
      ]);
    }
  };

  console.log(editPostData);
  return (
    <div>
      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="text"
          placeholder="Title"
          name="title"
          onChange={
            handleChange
          }
        />
        <input
          type="text"
          placeholder="body"
          name="body"
          onChange={
            handleChange
          }
        />
        <button type="submit">
          Add Post
        </button>
      </form>
      <ul>
        {posts?.map(
          (post) => (
            <li key={post.id}>
              {editPostId ===
              post.id ? (
                <>
                  <input
                    defaultValue={
                      post.title
                    }
                    onChange={(
                      e
                    ) => {
                      seEditPostData(
                        {
                          ...editPostData,
                          title:
                            e
                              .target
                              .value,
                        }
                      );
                    }}
                  />

                  <input
                    defaultValue={
                      post.body
                    }
                    onChange={(
                      e
                    ) => {
                      seEditPostData(
                        {
                          ...editPostData,
                          body: e
                            .target
                            .value,
                        }
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <h2>
                    {
                      post.title
                    }
                  </h2>
                  <p>
                    {
                      post.body
                    }
                  </p>
                </>
              )}
              <button
                onClick={() =>
                  handleDelete(
                    post.id
                  )
                }
              >
                Delete
              </button>
              <button
                onClick={() =>
                  setEditPostId(
                    (
                      prevEditPostId
                    ) => {
                      if (
                        prevEditPostId ===
                        post.id
                      ) {
                        (async () => {
                          const response =
                            await axios.patch(
                              `http://localhost:3000/posts/${post.id}`,
                              editPostData
                            );
                          if (
                            response.status ===
                            200
                          ) {
                            setPosts(
                              posts?.map(
                                (
                                  post
                                ) =>
                                  post.id ===
                                  editPostId
                                    ? response.data
                                    : post
                              )
                            );
                          }
                        })();

                        return undefined;
                      }
                      seEditPostData(
                        {
                          title:
                            post.title,
                          body: post.body,
                        }
                      );
                      return post.id;
                    }
                  )
                }
              >
                {editPostId ===
                post.id
                  ? "Save"
                  : "Edit"}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
