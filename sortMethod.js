let arr = [1, 23, 35, 2, 3, 4, 5, 46, 5, 7, 6, 8, 7, 6, 7, 8, 93, 25, 4, 8, 7, 2, 3, 4, 5, 8, 0, 9,379,2,3,5,7,9,2,3,5749,2,7,3,45,8,9,7,9,4,5,82,3,4,7,844];

// let arr=(function(){
//     let arr1=[];
//     for(let i=0;i<10000;i++){
//         arr1[i]=Math.floor(Math.random()*10000);
//     }
//     return arr1;
// })();
//1.冒泡--交换元素位置，第一次交换完最后一个是最大值，第二次倒数第二个是第二大的值......
function pop(arr) {
    let arr1=Array.from(arr);
    let length=arr1.length;
    console.time('pop')
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - (i + 1); j++) {//第一次交换length-1次,第二次因为第一次已经排好最后一个，所以length-2次
            if (arr1[j] > arr1[j + 1]) {
                [arr1[j + 1], arr1[j]] = [arr1[j], arr1[j + 1]];//交换位置
            }
        }
    }
    console.timeEnd('pop');
    return arr1;
}

//console.log(pop(arr).toString())

pop(arr)
//2.选择排序--思路找到最小值放在第一个位置，找到第二小的放在第二个位置......

function select(arr){
    let arr2=Array.from(arr);
    let length=arr2.length;
    //let min=0;
     console.time('select')
    for(let i=0;i<length;i++){
         // min=arr2[i];
        for(let j=i;j<length;j++){//j=0--->j=i因为前边的位置已经排好了，再去比较
            if(arr2[i]>arr2[j+1]){
                [arr2[i],arr2[j+1]]=[arr2[j+1],arr2[i]];
            }
        }
    }
     console.timeEnd('select');
    return arr2;
}

//console.log(select(arr).toString())
select(arr)


//3.插入排序--假设第一个位置已经排好，第二个与第一个比较，该插入到它前边还是后边，假设第二项也排好了，第三项改插入第一二项的前后还是中间......以此类推
//同时插入对应位置时候要移动其右边的所有元素的位置+1;
function insert(arr){
    let arr3=Array.from(arr);
    let length=arr3.length;
    let j=0,//记录假设已经排好序的位置
    temp=0;//记录带插入的元素
    console.time('insert')
    for(let i=1;i<length;i++){//从第二项开始插入
        j=i;
        temp=arr3[i];
        while(j>0 && temp<arr3[j-1]){//首先检查待插入的是否比前边已经排好序的数组最后一个小，如果比它大就不用循环了,进入下一次for的循环（检测下一个数据)
            arr3[j]=arr3[j-1];//(@)
            j--;
        }
        arr3[j]=temp;//(@)处代码把元素都向后移动了一位，temp的位置被前边的占用了，现在最后找的的j位置空着，把temp元素填入空位置
    }
    console.timeEnd('insert');
    return arr3;
}

//console.log(insert(arr).toString())
insert(arr)
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
    let arr4=Array.from(arr);
    let length=arr4.length;
    let temp=0;
    let h=1;
    console.time('shell')
    while(h<length/3){
        h=3*h+1;
    }
    for(h;h>0;h=Math.floor(h/3)){
        for(let i=h;i<length;i++){
            temp=arr4[i];
            for( j = i-h ;j>=0 && temp<arr4[j];j-=h){
                arr4[j+h]=arr4[j];
            }
            arr4[j+h]=temp;
        }
    } 
    console.timeEnd('shell');
    return arr4;
}

console.log(shell(arr).toString())
//console.log(arr.toString())
