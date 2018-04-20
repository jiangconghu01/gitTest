let arr = [1, 23, 35, 2, 3, 4, 5, 46, 5, 7, 6, 8, 7, 6, 7, 8, 93, 25, 4, 8, 7, 2, 3, 4, 5, 8, 0, 9,379,2,3,5,7,9,2,3,5749,2,7,3,45,8,9,7,9,4,5,82,3,4,7,844];

// let arr=(function(){
//     let arr=[];
//     for(let i=0;i<20000;i++){
//         arr[i]=Math.floor(Math.random()*50000);
//     }
//     return arr;
// })();
//1.冒泡--交换元素位置，第一次交换完最后一个是最大值，第二次倒数第二个是第二大的值......
function pop(arr) {
    let length=arr.length;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - (i + 1); j++) {//第一次交换length-1次,第二次因为第一次已经排好最后一个，所以length-2次
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];//交换位置
            }
        }
    }
    return arr;
}
let arr1=Array.from(arr);
//console.log(pop(arr1).toString())
console.time('pop')
let p=pop(arr1);
console.timeEnd('pop');
//2.选择排序--思路找到最小值放在第一个位置，找到第二小的放在第二个位置......

function select(arr){

    let length=arr.length;
    //let min=0;
    for(let i=0;i<length;i++){
         // min=arr[i];
        for(let j=i;j<length;j++){//j=0--->j=i因为前边的位置已经排好了，再去比较
            if(arr[i]>arr[j+1]){
                [arr[i],arr[j+1]]=[arr[j+1],arr[i]];
            }
        }
    }

    return arr;
}
let arr2=Array.from(arr);
//console.log(select(arr2).toString())
console.time('select');
select(arr2);
console.timeEnd('select');

//3.插入排序--假设第一个位置已经排好，第二个与第一个比较，该插入到它前边还是后边，假设第二项也排好了，第三项改插入第一二项的前后还是中间......以此类推
//同时插入对应位置时候要移动其右边的所有元素的位置+1;
function insert(arr){
    let length=arr.length;
    let j=0,//记录假设已经排好序的位置
    temp=0;//记录带插入的元素
    for(let i=1;i<length;i++){//从第二项开始插入
        j=i;
        temp=arr[i];
        while(j>0 && temp<arr[j-1]){//首先检查待插入的是否比前边已经排好序的数组最后一个小，如果比它大就不用循环了,进入下一次for的循环（检测下一个数据)
            arr[j]=arr[j-1];//(@)
            j--;
        }
        arr[j]=temp;//(@)处代码把元素都向后移动了一位，temp的位置被前边的占用了，现在最后找的的j位置空着，把temp元素填入空位置
    }
    return arr;
}

//console.log(insert(arr).toString())
let arr3=Array.from(arr);
console.time('insert')
let ins=insert(arr3);
console.timeEnd('insert');
// function insert2(arr){//用二分法查找，改进插入排序
//     let arr3=Array.from(arr);
//     let length=arr3.length;
//     let j=0,
//     temp=0;
//     let left=0,right=0,midle=0;

//     console.time('insert2')
//     for(let i=1;i<length;i++){
//         j=i;
//         temp=arr3[i];
//         left=0;right=i-1;
//         while(left<=right){
//            midle=parseInt((left+right)/2)
//             j--;
//         }
//         arr3[j]=temp;
//     }
//     console.timeEnd('insert2');
//     return arr3;
// }

// console.log(insert2(arr).toString())
//insert2(arr)
//shell排序，又称希尔排序，是对插入排序的优化
//插入排序的缺点是每次移动一个，如上边的（@）一行的代码，元素一个一个向后移动;希尔排序的思想就是一次移动很多步，移动的步距不同效率也不同
//对于步距的计算没有统一的规定

function shell(arr){

    let length=arr.length;
    let temp=0;
    let h=1;
    while(h<length/3){
        h=3*h+1;
    }
    for(h;h>0;h=Math.floor(h/3)){
        for(let i=h;i<length;i++){
            temp=arr[i];
            for( j = i-h ;j>=0 && temp<arr[j];j-=h){
                arr[j+h]=arr[j];
            }
            arr[j+h]=temp;
        }
    } 

    return arr;
}
let arr4=Array.from(arr);
    console.time('shell')
let she=shell(arr4)
    console.timeEnd('shell');
//console.log(shell(arr).toString())
//console.log(arr.toString())
    
function quick(arr){
    if(arr.length<=1){
        return arr;
    }
    let length=arr.length;
    let midle=arr.splice(Math.floor(length/2),1)[0];//截取数组中间的值作为参考值
    let left=[],right=[];
    for(let i=0;i<arr.length;i++){
        if(arr[i]<=midle){
            left.push(arr[i]);
        }else{
            right.push(arr[i]);
        }
    }
    return quick(left).concat(midle,quick(right));
}
let arr5=Array.from(arr);
console.time('quick')
let copy=quick(arr5);
console.timeEnd('quick');
let arr6=Array.from(arr);

console.time('quick2')
let copy2=Array.prototype.sort(arr6);
console.timeEnd('quick2');
//console.log(copy.toString());


function quickSort(arr){
    let left=0,
    right=arr.length-1;
    function quick(arr,left,right){
        let pos;
        if(arr.length>1){
            pos=getPos(arr,left,right);
            if(left<pos-1){
                quick(arr,left,pos-1);
            }
            if(pos<right){
                quick(arr,pos,right);
            }
        }

    }
    function getPos(arr,left,right){
        let midle=arr[Math.floor((left+right)/2)],//中间参照物
        i=left,
        j=right;
        while(i<=j){   //左指针还未超过右指针时候继续交换两边元素
            while(arr[i]<midle){ //在左边找到一个比参考值大的元素，只要找都循环终止arr[i]>midle------>进入下一个循环
                i++;
            }
            while(arr[j]>midle){ //在右边找到一个比参考值小的元素，只要找都循环终止arr[j]<midle------>进入下个面的交换逻辑
                j--;
            }
            if(i<=j){            //内部两个while改变了i,j的值，我们需要再次判断指针否已经交叉
                [arr[i],arr[j]]=[arr[j],arr[i]];  //交换值
            }
        }
        return i;
    }
    quick(arr,left,right);
    return arr;
}

let arr7=Array.from(arr);

console.time('quick3')
let copy3=quickSort(arr7);
console.timeEnd('quick3');
console.log(copy3.toString());
