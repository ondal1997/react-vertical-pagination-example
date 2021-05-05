import { useEffect, useLayoutEffect, useRef, useState } from "react";

const defaultState = {
  isLoading: false,
  posts: [],
  error: null,
};

const useFetch = (projectId) => {
  // '비동기 컴포넌트 상태 변경' 제어를 위한 변수
  const isMounted = useRef(true);
  const promiseRef = useRef(null);

  const [state, setState] = useState(defaultState);

  // TODO: useCallback 사용 고려하기
  const fetchPosts = (init = false) => {
    const posts = init ? [] : state.posts;

    setState({
      isLoading: true,
      posts,
      error: null,
    });

    (async () => {
      let result;
      let promise;
      try {
        // 서버 api 추가 시 대응 수정이 필요한 부분
        promise = fetch(
          `http://3.15.16.150:8090/api/posts/project/${projectId}`
        );
        promiseRef.current = promise;
        const res = await promise;
        if (promiseRef.current !== promise || !isMounted) {
          return;
        }
        if (res.status !== 200) {
          throw res.status;
        }

        // 테스트를 위한 딜레이 추가
        promise = new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        promiseRef.current = promise;
        await promise;
        if (promiseRef.current !== promise || !isMounted) {
          return;
        }

        promise = res.json();
        promiseRef.current = promise;
        result = await promise;
        if (promiseRef.current !== promise || !isMounted) {
          return;
        }
      } catch (error) {
        setState({
          isLoading: false,
          posts,
          error,
        });
        return;
      }
      // 서버 api 추가 시 대응 수정이 필요한 부분
      result = result.slice(0, posts.length + 3);
      setState({
        isLoading: false,
        posts: result,
        error: null,
      });
    })();
  };

  useLayoutEffect(() => {
    fetchPosts(true);
  }, [projectId]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  });

  return { ...state, fetchPosts };
};

export default useFetch;
