// console.log('script start');//遇到同步任务放进执行栈中

// setTimeout(() => {//遇到宏事件，放入宏事件队列——宏1
//   console.log('timeout');
// }, 1 * 2000);

// Promise.resolve()
// .then(function() {
//   console.log('promise1');//遇到微事件，放入微事件队列——微1
// }).then(function() {
//   console.log('promise2');//执行完微任务1后再次遇到微任务，放入微任务队列——微1-1
// });

// async function foo() {
//   await bar()//执行后返回一个promise//打印async2 end
//   console.log('async1 end')//promise执行后的回调//微任务2
// }
// foo()//同步任务，执行函数

// function bar() {
//   console.log('async2 end') 
// }

// async function errorFunc () {
//   try {
//     await Promise.reject('error!!!')//遇到微事件，放入微事件队列——微3//且后续代码都被放进微任务队列
//     // console.log('asdasda')
//   } catch(e) {
//     console.log(e)
//   }
//   console.log('async1');
//   return Promise.resolve('async1 success')
// }
// errorFunc().then(res => console.log(res))//先执行errorFunc//执行完毕后继续是微任务，放入微任务队列

// console.log('script end')//同步任务，放入执行栈

//script start
// async2 end
// script end
// promise1
// async1 end
// error!!!
// async1
// promise2
// async1 success
// timeout

// console.log('1');

// setTimeout(() => {
//   console.log('2');
//   Promise.resolve().then(() => {
//     console.log('3');
//   })
//   new Promise((resolve) => {
//     console.log('4');
//     resolve();
//   }).then(() => {
//     console.log('5')
//   })
// })

// Promise.reject().then(() => {
//   console.log('13');
// }, () => {
//   console.log('12');
// })

// new Promise((resolve) => {
//   console.log('7');
//   resolve();
// }).then(() => {
//   console.log('8')
// })

// setTimeout(() => {
//   console.log('9');
//   Promise.resolve().then(() => {
//     console.log('10');
//   })
//   new Promise((resolve) => {
//     console.log('11');
//     resolve();
//   }).then(() => {
//     console.log('12')
//   })
// })
// //1 7 12 8 2 4 3 5 9 11 10 12

// new Promise((resolve, reject) => {
//   console.log(1)
//   resolve()
// })
// .then(() => { // 微1-1
//   console.log(2)
//   new Promise((resolve, reject) => {
//       console.log(3)
//       setTimeout(() => { // 宏2
//         reject();
//       }, 3 * 1000);
//       resolve() // TODO 注1
//   }).then(() => { // 微1-2  TODO 注2
//       console.log(4)
//       new Promise((resolve, reject) => {
//           console.log(5)
//           resolve();
//       }).then(() => { // 微1-4
//           console.log(7)
//         }).then(() => { // 微1-6
//           console.log(9)
//         })
//     }).then(() => {  // 微1-5 TODO 注3
//       console.log(8)
//     })
// })
// .then(() => { // 微1-3
//   console.log(6)
// })
// 1 2 3 4 5 6 7 8 9

Promise.resolve()
  .then(() => {
    console.log('promise1');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('timer2')
          resolve()
        }, 0)
    })
      .then(async () => {
        await foo();
        return new Error('error1')
      })
      .then((ret) => {
        setTimeout(() => {
          console.log(ret);
          Promise.resolve()
          .then(() => {
            return new Error('error!!!')
          })
          .then(res => {
            console.log("then: ", res)
          })
          .catch(err => {
            console.log("catch: ", err)
          })
        }, 1 * 3000)
      }, err => {
        console.log(err);
      })
      .finally((res) => {
        console.log(res);
        throw new Error('error2')
      })
      .then((res) => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  })
  .then(() => {
    console.log('promise2');
  })

function foo() {
  setTimeout(() => { 
    console.log('async1');
  }, 2 * 1000);
}

setTimeout(() => {
  console.log('timer1')
  Promise.resolve()
    .then(() => {
      console.log('promise3')
    })
}, 0)

console.log('start');

async function async1() {
  console.log('async1 start');
  new Promise((resolve, reject) => {
    try {
      throw new Error('error1')
    } catch(e) {
      console.log(e);
    }
    setTimeout(() => { // 宏3
      resolve('promise4')
    }, 3 * 1000);
  })
    .then((res) => { // 微3-1
      console.log(res);
    }, err => {
      console.log(err);
    })
    .finally(res => { // 微3-2 // TODO注3
      console.log(res);
    })
  console.log(await async2()); // 微4-1  TODO-注1
  console.log('async1 end'); // 微4-2 // TODO-注2
}

function async2() {
  console.log('async2');
  return new Promise((resolve) => {
    setTimeout(() => { // 宏4
      resolve(2)
    }, 1 * 3000);
  })
}

console.log('script start');

setTimeout(() => { // 宏2
  console.log('setTimeout');
}, 0)

async1();

new Promise((resolve) => {
  console.log('promise1');
  resolve();
})
  .then(() => { // 微1-2
    console.log('promise2');
    return new Promise((resolve) => {
      resolve()
    })
      .then(() => { // 微1-3
        console.log('then 1-1')
      })
  })
  .then(() => { // 微1-4
    console.log('promise3');
  })


console.log('script end');