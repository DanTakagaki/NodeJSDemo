const { userInfo } = require("os");

let NAME = 'Max';
let AGE = 25;
let HAS_HOBBIES = true;

//arrow functions you can use anonimous functions
const sumarizeUser = (usarName, userAge, userHasHobby) => {

    return ('Name is: ' + usarName + ', age is: ' + userAge + ', user hobby is: ' + userHasHobby);
 }
const add = (a, b) => a + b;
const addOne = a => a +1;
const addRandom = () => 1 + 2;

console.log(sumarizeUser(NAME, AGE, HAS_HOBBIES));
console.log(add(3, 5));
console.log(addOne(3));
console.log(addRandom());

const person = {
    name: 'Max',
    age: 29,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

console.log('person :', person);
person.greet();

//Arrays
const hobbies = ['Sports', 1, true, {}]
for( let hobby of hobbies) {
    console.log(hobby);
}
console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
console.log(hobbies);

hobbies.push('New object');
console.log('hobbies: ', hobbies);

//Copy arrays
const copiedArray = hobbies.slice();
console.log('copiedArray: ', copiedArray);

//Spread operator. Pull out objects from object and push it in an array.
const spreadArray = [...hobbies];
console.log('spreadArray: ', spreadArray);
//Also can pull out elements like person (properties) even methods
const spreadPerson = {...person};
console.log('spreadPerson: ', spreadPerson);
spreadPerson.greet();

//Nested array
const nestedArray = [hobbies];
console.log(nestedArray);

//Rest operator
const restArray = (...args) => {
    return args;
};
console.log('restArray: ', restArray(1,2,3,4));

//Object destructuring verbose
const printName = ({ name }) => {
    console.log(name);
}
printName(person);

//Object destructuring inline
const { name, age } = person;
console.log(name, age);

//Array destructuring inline from 0...X
const [hobby1, hobby2] = hobbies;
console.log('Array destructuring: ', hobby1, hobby2)

//Async call using promises
const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('callback done!');
        }, 100);
    });
    return promise
};

setTimeout(() => {
    console.log('Timer is done!');
    fetchData()
        .then(text => {
            console.log(text)
            return fetchData();
        })
        .then(text2 => {
            console.log(text2);
        });
}, 200);

console.log('first');

//Template literals
const normalString = 'A String';
const quotedString = "Another String";
console.log(`String with inline normalString = ${normalString}`)

