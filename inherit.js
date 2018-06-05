function Super () {
  this.supproperty = true;
  this.colors = ['aa', 'bb', 'cc'];
  this.name = 'super';
}
Super.prototype.getSup = function () {
  return this.supproperty;
};

function Sub () {
  this.subproperty = false;
}
Sub.prototype = new Super();

Sub.prototype.getSub = function () {
  return this.subproperty;
};
var instance = new Sub();
var ins2 = new Sub();
console.log('1--super:' + instance.getSup() + ' sub:' + instance.getSub());
console.log('2----- ' + instance instanceof Sub);
console.log('3----- ' + instance instanceof Super);
console.log('4----- ' + instance instanceof Object);
console.log('5----- ' + Super.prototype.isPrototypeOf(instance));
console.log('5----- ' + Sub.prototype.isPrototypeOf(instance));
console.log(typeof instance);
instance.colors.push('dd');
instance.name = 'instance';
console.log(instance.colors + '  ' + instance.name);
console.log(ins2.colors + '  ' + ins2.name);
console.log('--------------------------------------------------------------');
// 为了解决上述原型链中父类的属性中有引用类型，子类实例重新定义属性无法覆盖，导致影响其他实例的问题，引入‘借用构造函数’
function SuperT (name) {
  this.supproperty = true;
  this.colors = ['aa', 'bb', 'cc'];
  this.name = name;
}

function SubT (name) {
  SuperT.call(this, name); // 子构造函数作用域调用父级构造函数
  this.age = 29;
}
SubT.prototype = new SuperT(); // (99999999999)
SubT.prototype.constructor = SubT; // (99999999999)会改变构造函数的可枚举性
SubT.prototype.getSub = function () {
  return this.subproperty;
};
SuperT.prototype.sayHi = function () {
  console.log('Hi!!!');
};
var ins3 = new SubT('sub3');
var ins4 = new SubT('sub4');
ins3.colors.push('dd');
ins4.name = 'instance';
console.log(ins3.colors + '  ' + ins3.name);
console.log(ins4.colors + '  ' + ins4.name);
// ins3.sayHi();
// 上述借用构造函数解决了引用类型相互影响的问题，而且还可以在子类构造函数中向超类构造函数中传递对象，但是
// 1：方法都在构造函数中定义，函数无法复用2：在超类型的原型中定义的方法子类型不可见
// 于是组合一下------加上上边的原型替换--（9999999999）;下面的syaHi方法就能访问了
ins3.sayHi();
console.log('--------------------------------------------------------------');
// 组合方式继承貌似解决了继承中的问题，但是它最大的问题是：会调用两次超类型的构造函数
// 让我们先来看一下原型继承
function object (o) {
  function F () { }
  F.prototype = o;
  return new F();
}
// 如下
var person = {
  name: 'jack',
  friends: ['ee', 'cc', 'aa']
};
var person1 = object(person);
var person2 = object(person);
person1.name = 'lucy';
person1.friends.push('jchjch');
console.log(person1.name + '   ' + person1.friends);
console.log(person2.name + '   ' + person2.friends); // 单独的改变原型对象并不能解决引用类型属性在实例中共享了数据问题
console.log(person.name + '   ' + person.friends);
// 再来看一下寄生方式(思路与原型模式紧密相连)
function createPerson (o) {
  function F () { }
  F.prototype = o;
  var clone = new F();
  clone.sayHello = function () {
    console.log('Hello!!!!!!!');
  };
  return clone;
}
var person3 = createPerson(person);
person3.sayHello();
console.log('--------------------------------------------------------------');
// 在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式的继承是一种有用的模式

// 最理想的继承形式----组合寄生式继承
function SupTy (name) {
  this.supproperty = true;
  this.colors = ['aa', 'bb', 'cc'];
  this.name = name;
  this.age = 55;
}

function SubTy (name) {
  SupTy.call(this, name); // 子类作用域调用父类构造函数，继承其属性
  this.subproperty = false;
}
inheritPrototype(SupTy, SubTy);

function inheritPrototype (sup, sub) {
  function F () { } // 临时构造函数
  F.prototype = sup.prototype; // 修改临时构造函数的原型为父类原型
  var clone = new F(); // 克隆一个对象使继承父类
  clone.constructor = sub; // 设置克隆对象的构造函数为子类的构造函数
  sub.prototype = clone; // 设置子类的原型为克隆对象
}
SubTy.prototype.testHi = function () {
  console.log('test inherits');
};
var test1 = new SubTy();
test1.age = 66;
test1.colors.push('java');
var test2 = new SubTy();
test1.testHi();
test2.testHi();
console.log('test1.colors:' + test1.colors);
console.log('test2.colors:' + test2.colors);
console.log('--------------------------------------------------------------');
// 实例运用组合寄生式继承 一个类，该类有Date的所有方法和属性，并能自由扩展；
function newDate () {
  Date.call(this, arguments);
  this.test = 1;
}

function inherits (sup, sub) {
  function Inner () { }
  Inner.prototype = sup.prototype;
  var clone = new Inner();
  clone.constructor = sub;
  sub.prototype = clone;
}
inherits(Date, newDate);
newDate.prototype.getTest = function () {
  return this.getTime();
};
newDate.prototype.sayTest = function () {
  console.log('test!!!!!!!');
};
// var t = new newDate()
// t.sayTest()
// console.log(t.getTest());
// v8执行引擎限制了，调用对象的[[class]] 不是Date，则报错
function myString () {
  String.call(this, arguments);
  this.name = 'mystring';
}

function inheritstring (sup, sub) {
  function F () { }
  F.prototype = sup.prototype;
  var clone = new F();
  clone.constructor = sub;
  sub.prototype = clone;
}
inheritstring(String, myString);

// es6语法
class NewDate2 extends Date {
  constructor () {
    super();
    this.test = 'test es6 calss!';
  }
  getTest () {
    return this.getTime();
  }
}
let aa = new NewDate2();
console.log(aa.getTest());
console.log(aa.constructor);
console.log(`year:${aa.getYear()} month:${aa.getMonth() + 1} day:${aa.getDay()}`);
