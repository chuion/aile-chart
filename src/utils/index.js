/**
 * 检测数据类型
 * @param {any} data 待检测的数据
 */
export function checkType(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
    .toLowerCase();
}

/**
 * 属性名以_开头的表示需要进行合并操作，否则直接赋值
 * @param {*} defaultOption
 * @param {*} option
 */
export function merge(defaultOption, option) {
  const keys = Object.keys(option);
  keys.forEach(key => {
    if (key.startsWith('_')) {
      const realKey = key.substr(1);
      if (checkType(option[key]) === 'array') {
        option[key].forEach((item, index) => {
          defaultOption[realKey][index] === undefined && (defaultOption[realKey][index] = {});
          merge(defaultOption[realKey][index], item);
        });
      } else if (checkType(option[key] === 'object')) {
        merge(defaultOption[realKey], option[key]);
      } else {
        throw new Error(`传入错误参数【${key}】`);
      }
    } else {
      defaultOption[key] = option[key];
    }
  });
  return defaultOption;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 深拷贝
 * @param {*} data
 * @param {*} hash
 */
export function cloneDeep(data, hash = new WeakMap()) {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('传入参数不是对象');
  }
  // 判断传入的待拷贝对象的引用是否存在于hash中
  if (hash.has(data)) {
    return hash.get(data);
  }
  const newData = {};
  const dataKeys = Object.keys(data);
  dataKeys.forEach(value => {
    const currentDataValue = data[value];
    // 基本数据类型的值和函数直接赋值拷贝
    if (typeof currentDataValue !== 'object' || currentDataValue === null) {
      newData[value] = currentDataValue;
    } else if (Array.isArray(currentDataValue)) {
      // 实现数组的深拷贝
      newData[value] = [];
      currentDataValue.forEach(item => {
        if (typeof item !== 'object') {
          newData[value].push(item);
        } else {
          newData[value].push(cloneDeep(item, hash));
        }
      });
    } else if (currentDataValue instanceof Set) {
      // 实现set数据的深拷贝
      newData[value] = new Set([...currentDataValue]);
    } else if (currentDataValue instanceof Map) {
      // 实现map数据的深拷贝
      newData[value] = new Map([...currentDataValue]);
    } else {
      // 将这个待拷贝对象的引用存于hash中
      hash.set(data, data);
      // 普通对象则递归赋值
      newData[value] = cloneDeep(currentDataValue, hash);
    }
  });
  return newData;
}
