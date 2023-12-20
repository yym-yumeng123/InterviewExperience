---
outline: deep
title: "手写代码"
# sidebar: false 左边侧边栏
# aside: left
---


# 数组

## JS 数组去重

```js
var arr = [1, 2, 3, 4, 5, 1]
// 1. new Set
[...new Set(arr)]

// 2. for indexOf
var newArr = []
for(let i = 0; i < arr.length; i++) {
  if(newArray.indexOf(arr[i]) === -1) {
    newArr.push(arr[i])
  }
}

// reduce [] 也是无值就插入
const newArr = arr.reduce((prev, cur) => {
  prev.includes(cur) ? prev : prev.concat(cur)
}, [])
```

## 多维数组的最大值

```js
// 大数组包含多个小数组, 找到每个小数组的最大值, 串联起来, 形成一个新数组
const arr = [
  [4, 5, 1, 3],
  [12, 27, 36],
  [1000, 800, 1],
]

arr.forEach((item, index) => {
  newArr.push(Math.max(...item))
})
```

# 字符串

## 一个字符串中出现次数最多的字符, 统计次数

```js
const str = "aaabbbbccccccdddeeeeeeeeee"
const obj = {}

// 得到一个 map 
for (let i = 0; i < str.length; i++) {
  let char = str.charAt(i)
  obj[char] ? obj[char]++ : (obj[char] = 1)
}
// 循环 map, 得到最大的值
let max = 0
for(const key in obj) {
  if(max < obj[key]) {
    max = obj[key]
  }
}
```
