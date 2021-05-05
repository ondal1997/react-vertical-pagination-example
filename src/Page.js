import useFetch from "./useFetch";

const Page = ({ projectId }) => {
  const { posts, isLoading, error, fetchPosts } = useFetch(projectId);

  return (
    <>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.id}</h2>
          <h3>{post.writer.id}</h3>
          <p>{post.contents}</p>
        </div>
      ))}

      {error ? (
        <>
          <h1>{error.toString()}</h1>
          <button onClick={fetchPosts}>재시도</button>
        </>
      ) : isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <button onClick={fetchPosts}>더 보기</button>
      )}
    </>
  );
};

export default Page;
