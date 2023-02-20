// // const pro1 = new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //         resolve("Hi");
// //     }, 800);
// // });

// // const pro2 = new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //         resolve("Hi 2");
// //     }, 1500);
// // });

// // const pro3 = new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //         resolve("Hi 3");
// //     }, 2000);
// // });

// // const promises = [pro1, pro2, pro3];

// // Promise.all(promises).then((e) => console.log(e))
// // Promise.race(promises).then((e) => console.log('race',e))
// // Promise.allSettled(promises).then((e) => console.log('allSettled',e))
// // Promise.any(promises).then((e) => console.log('any',e))


// // To experiment with error handling, "threshold" values cause errors randomly
// const THRESHOLD_A = 8; // can use zero 0 to guarantee error

// function tetheredGetNumber(resolve, reject) {
//   setTimeout(() => {
//     const randomInt = Date.now();
//     const value = randomInt % 10;
//     if (value < THRESHOLD_A) {
//       resolve(value);
//     } else {
//       reject(`Too large: ${value}`);
//     }
//   }, 500);
// }

// function determineParity(value) {
//   const isOdd = value % 2 === 1;
//   return { value, isOdd };
// }

// function troubleWithGetNumber(reason) {
//   const err = new Error("Trouble getting number", { cause: reason });
//   console.error(err);
//   throw err;
// }

// function promiseGetWord(parityInfo) {
//   return new Promise((resolve, reject) => {
//     const { value, isOdd } = parityInfo;
//     if (value >= THRESHOLD_A - 1) {
//       reject(`Still too large: ${value}`);
//     } else {
//       parityInfo.wordEvenOdd = isOdd ? "odd" : "even";
//       resolve(parityInfo);
//     }
//   });
// }

// new Promise(tetheredGetNumber)
//   .then(determineParity, troubleWithGetNumber)
//   .then(promiseGetWord)
//   .then((info) => {
//     console.log(`Got: ${info.value}, ${info.wordEvenOdd}`);
//     return info;
//   })
//   .catch((reason) => {
//     if (reason.cause) {
//       console.error("Had previously handled error");
//     } else {
//       console.error(`Trouble with promiseGetWord(): ${reason}`);
//     }
//   })
//   .finally((info) => console.log("All done"));

