
**封装通用逻辑: useAsync: 发起异步请求获取数据并显示在界面上**

```js
import { useState } from 'react';

const useAsync = (asyncFunction) => {
  // 设置三个异步逻辑相关的 state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 定义一个 callback 用于执行异步逻辑
  const execute = useCallback(() => {
    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
    setLoading(true);
    setData(null);
    setError(null);
    return asyncFunction()
      .then((response) => {
        // 请求成功时，将数据写进 state，设置 loading 为 false
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        // 请求失败时，设置 loading 为 false，并设置错误状态
        setError(error);
        setLoading(false);
      });
  }, [asyncFunction]);

  return { execute, loading, data, error };
};

export default function UserList() {
  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
  const {
    execute: fetchUsers,
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const res = await fetch("https://reqres.in/api/users/");
    const json = await res.json();
    return json.data;
  });

  return (
    // 根据状态渲染 UI...
  );
}
```

**useData 获取数据**

```js
// "竞态条件"：两个不同的请求 "相互竞争"，并以与你预期不符的顺序返回。
function useData(url) {
  const [data, setData] = useState(null)
  useEffect(() => {
    // 添加一个 清理函数 来忽略较早的返回结果
    let ignore = false
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setData(json)
        }
      })
    return () => {
      ignore = true
    }
  }, [url])
  return data
}
```

**计数器**

```js
import { useState, useCallback } from "react"

function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0)
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count])
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count])

  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement }
}
```