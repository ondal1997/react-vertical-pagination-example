import { useLayoutEffect, useRef, useState } from "react";

const initialState = {
  isLoading: false,
  posts: [],
  error: null,
};

const useFetch = (projectId) => {
  const projectIdRef = useRef(null);
  const lastPostIdRef = useRef(null);

  const [state, setState] = useState(initialState);

  const fetchPosts = () => {
    let lastPostId = lastPostIdRef.current;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: false,
    }));

    (async () => {
      let result;
      try {
        // 서버 api 추가 시 대응 수정이 필요한 부분
        const res = await fetch(
          `http://3.15.16.150:8090/api/posts/project/${projectId}`
        );
        if (res.status !== 200) {
          throw res.status;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        result = await res.json();
      } catch (e) {
        if (
          projectId === projectIdRef.current &&
          lastPostId === lastPostIdRef.current
        ) {
          setState((currentState) => ({
            ...currentState,
            isLoading: false,
            error: e,
          }));
        }
        return;
      }
      if (
        projectId === projectIdRef.current &&
        lastPostId === lastPostIdRef.current
      ) {
        // 서버 api 추가 시 대응 수정이 필요한 부분
        result = result.slice(
          lastPostIdRef.current === null
            ? 0
            : result.findIndex((post) => post.id === lastPostIdRef.current) + 1,
          lastPostIdRef.current === null
            ? 3
            : result.findIndex((post) => post.id === lastPostIdRef.current) + 4
        );

        if (result.length) {
          lastPostIdRef.current = result[result.length - 1].id;
        }
        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          posts: [...currentState.posts, ...result],
        }));
      }
    })();
  };

  useLayoutEffect(() => {
    projectIdRef.current = projectId;
    lastPostIdRef.current = null;

    setState(initialState);

    fetchPosts();

    return () => {
      projectIdRef.current = null;
    };
  }, [projectId]);

  return { ...state, fetchPosts };
};

export default useFetch;
