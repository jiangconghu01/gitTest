import Vue from 'vue'
const comA={
template: '<div ref="div">{{text}}</div>',
  data() {
      return{
        text: 999
      }
  },
  methods:{

  },
  mounted(){
      //console.log(this);
      console.log(this.$options);
      this.$options.render=(h)=>{
          return h('p', {}, 'new render function')
      }
     // this.$forceUpdate();    //重新定义了render方法后要
     //或者改变一下数据，让vue渲染dom，如this.text=888;
      //this.$options.render();
      //console.log(this.$root);
      //console.log(this.$refs);
      console.log(this.$el);
  }
}
const comB={
template: `<div ref="div">
<p>{{number}}</p>
</div>`,
  data() {
      return{
        text: 222,
        number:this.value
      }
  },
  props:{
    value:{
        type:Number,
        default:0
    }
  },
  watch:{
    value(){
        this.number=this.value;
    },
    number(){
        this.$emit('input',this.number);
    }
  },
  methods:{
    tochangeNumber(){
        this.number=456;
    }
  },
  mounted(){
    // let sefl=this;
    // setTimeout(()=>{
    //     sefl.tochangeNumber();
    // },1000);
  }
}

const app = new Vue({
  // el: '#root',
  template: `<div ref="div">
    {{text}} {{comtext}}
    <com/>
    <com2 v-model="comtext" ref="gg"></com2>
  </div>`,
  data: {
    text: 0,
    obj: {},
    comtext:123
  },
  components:{
    "com":comA,
    com2:comB
  }
  // watch: {
  //   text (newText, oldText) {
  //     console.log(`${newText} : ${oldText}`)
  //   }
  // }
  ,
  mounted(){
      let self=this;
      setTimeout(()=>{
        //self.$refs.gg.tochangeNumber();//父组件调用子组件方法
        comB.methods.tochangeNumber.call(self.$refs.gg);//调用者一定要是函数组件本身
      },1000);
      this.text+=1;
      this.text+=1;
      this.text+=1;
      this.text+=1;
      this.text+=1;
    
  }
})

app.$mount('#root')


// console.log(app.$data)
// console.log(app.$props)
// console.log(app.$el)
// console.log(app.$options)
// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }
// console.log(app.$root === app)
// console.log(app.$children)
// console.log(app.$slots)
// console.log(app.$scopedSlots)
// console.log(app.$refs)
// console.log(app.$isServer)

// const unWatch = app.$watch('text', (newText, oldText) => {
//   console.log(`${newText} : ${oldText}`)
// })
// setTimeout(() => {
//   unWatch()
// }, 2000)

// app.$once('test', (a, b) => {
//   console.log(`test emited ${1} ${b}`)
// })

// setInterval(() => {
//   app.$emit('test', 1, 2)
// }, 1000)

 //app.$forceUpdate()
