---
outline: deep
---

### 35. 搜索插入位置

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置

```js{14}
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  let left = 0
  let right = nums.length - 1
  // ans 初值设置为数组长度可以省略边界条件的判断，
  // 因为存在一种情况是 target 大于数组中的所有数, 需要插入到数组长度的位置
  let ans = nums.length

  while (left <= right) {
    // >> 1 右移1位
    let middle = ((right - left) >> 1) + left
    if (target <= nums[middle]) {
      ans = middle
      right = middle - 1
    } else {
      left = middle + 1
    }
  }

  return ans
}

输入: nums = [1,3,5,6], target = 5
输出: 2
输入: nums = [1,3,5,6], target = 7
输出: 4
```
