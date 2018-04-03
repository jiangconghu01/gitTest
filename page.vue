<template>
<div :class="$style.paging">
  <div :class="$style.uPages" >
    <div :class="$style.uTotal">
      <slot name="total">total</slot>
      <span>{{value.total}}</span>
    </div>
    <div :class="$style.uShowlist">
      <div :class="$style.uslp" v-show="openSizeBox">
        <div v-for="size in newSizeArray" @click="setPageSize(size)">{{size}}</div>
      </div>
      <span :class="$style.v">{{pageSize}}</span>
      <span :class="$style.trigger" @click="openSizePage()"></span>
    </div>
    <div :class="$style.ctrls">
      <div :class="$style.prev" @click="prePage()"></div>
      <div :class="$style.ctrl">
          <span :class="[pageIndex === page ? $style.selected : '',page != '…' ? $style.uPage : $style.uPage]" v-for="(page, index) in groupList" @click="setCurrent(page,index)">{{page}}</span>
      </div>
      <div :class="$style.next" @click="nextPage()"></div>
    </div>
    <div :class="$style.pgo">
      <span>
        <slot name="skip">skip</slot>
      </span>
      <input type="$style.text" v-model="pageInput" @keydown.enter="goPage()"><span :class="$style.trigger" @click="goPage()"></span>
    </div>
  </div>
</div>
</template>
<script>
import { TypeDetector } from '@/util/helper';

export default {
  name: 'Page',
  props: {
    value: {
      validator(val) {
        val = TypeDetector.is(val, 'Object') ? val : {};
        val.total = TypeDetector.is(val.total, 'Number') && val.total >= 0 ? val.total : 0;
        val.pageSize = TypeDetector.is(val.pageSize, 'Number') && val.pageSize >= 1 ? val.pageSize : 10;
        val.pageIndex = TypeDetector.is(val.pageIndex, 'Number') && val.pageIndex >= 1 ? val.pageIndex : 1;
        val.sizeScales = TypeDetector.is(val.sizeScales, 'Array') ? val.sizeScales : [10, 20, 50, 100];
        val.midNumber = TypeDetector.is(val.midNumber, 'Number') ? val.midNumber : 4;
        return val;
      }
    },
    pageCallBack: Function
  },
  data() {
    return {
      total: this.value.total,
      pageSize: this.value.pageSize,
      sizeScales: this.value.sizeScales,
      pageIndex: this.value.pageIndex,
      crtMidNumber: this.value.midNumber,
      openSizeBox: false,
      pageInput: 1,
    };
  },
  computed: {
    newSizeArray() {
      return this.sizeScales;
    },
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    groupList() {
      let allLen = this.crtMidNumber + 4;
      let baseNum = 2;
      if (this.totalPage <= allLen) {
        let numArray = new Array(this.totalPage);
        for (let i = 0; i < numArray.length; i++) {
          numArray[i] = i + 1;
        }
        return numArray;
      }
      let tempArray = new Array(allLen);
      let bakArray = new Array(this.totalPage - 3);
      let preNode = 4;
      let aftNode = this.totalPage - 3;
      bakArray.fill(0);
      Array.from(bakArray, x => (baseNum += 1 + x));
      if (this.pageIndex < preNode) {
        for (let i = 0; i < tempArray.length; i++) {
          if (i === tempArray.length - 2) {
            tempArray[i] = '…';
          } else if (i === tempArray.length - 1) {
            tempArray[i] = this.totalPage;
          } else {
            tempArray[i] = i + 1;
          }
        }
      }
      if (this.pageIndex > aftNode) {
        for (let i = 0; i < tempArray.length; i++) {
          if (i === 0) {
            tempArray[i] = 1;
          } else if (i === 1) {
            tempArray[i] = '…';
          } else {
            tempArray[i] = this.totalPage - (tempArray.length - i - 1);
          }
        }
      }
      if (preNode <= this.pageIndex && this.pageIndex <= aftNode) {
        tempArray[0] = 1;
        tempArray[1] = tempArray[tempArray.length - 2] = '…';
        tempArray[tempArray.length - 1] = this.totalPage;
        let startNum = aftNode - this.pageIndex + 2 < this.crtMidNumber ? (this.totalPage - this.crtMidNumber) : this.pageIndex;
        for (let i = 2; i < tempArray.length - 2; i++) {
          tempArray[i] = startNum + i - 3;
        }
      }
      return tempArray;
    }
  },
  methods: {
    setCurrent(page, index) {
      let goPage = page;
      let array = this.groupList;
      let total = this.totalPage;
      if (page === '…') {
        goPage = index === 1 ? Math.ceil((array[index + 1] + 1) / 2) : Math.ceil((array[index - 1] + total) / 2);
      }
      this.pageIndex = goPage;
    },
    openSizePage() {
      this.openSizeBox = !this.openSizeBox;
    },
    setPageSize(size) {
      this.pageSize = size;
      this.openSizeBox = false;
      if (this.pageIndex > this.totalPage) {
        this.pageIndex = 1;
      }
    },
    prePage() {
      if (this.pageIndex === 1) {
        return;
      }
      this.pageIndex -= 1;
    },
    nextPage() {
      if (this.pageIndex === this.totalPage) {
        return;
      }
      this.pageIndex += 1;
    },
    goPage() {
      let index = Number.parseInt(this.pageInput);
      if (!index) {
        return;
      }
      index = index > this.totalPage ? this.totalPage : index;
      this.pageIndex = index;
    },
    getValue() {
      return {
        total: this.total,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sizeScales: this.sizeScales,
        midNumber: this.midNumber
      };
    },
    setValue() {
      this.total = this.value.total;
      this.pageIndex = this.value.pageIndex;
      this.crtPageSiz = this.value.pageSize;
      this.sizeScales = this.value.sizeScales;
      this.midNumber = this.value.midNumber;
    }
  },
  created() {
    this.$emit('input', this.getValue());
    this.pageCallBack && this.pageCallBack(this.pageIndex, this.pageSize);
  },
  watch: {
    value() {
      this.setValue();
    },
    pageIndex() {
      this.$emit('input', this.getValue());
      this.pageCallBack && this.pageCallBack(this.pageIndex, this.pageSize);
    },
    pageSize() {
      this.$emit('input', this.getValue());
      this.pageCallBack && this.pageCallBack(this.pageIndex, this.pageSize);
    }
  }
};
</script>
<style lang="scss" module>
.paging {
    clear: both;
    width: 100%;
    margin-top: 25px;
    text-align: right;
    margin-bottom: 20px;
.uPages .uShowlist{
    position:relative;
    display:inline-block;
    *display:inline;
    *zoom:1;
    vertical-align:middle;
    border:1px solid #e3e3e3;
    padding-right:25px;
    margin-right:10px;
    border-radius:3px;
}
.uPages .uShowlist .v{ display: inline-block; padding-right:10px; min-width:15px;}
.uPages .uShowlist .trigger{
    position:absolute;
    display:block;
    width:24px;
    height:24px;
    right:0;
    top:0;
    border-left:1px solid #e3e3e3;
}
.uPages .uShowlist .trigger:before{
    content: "";
    position: absolute;
    display: block;
    width: 9px;
    height: 5px;
    right: 7px;
    top: 9px;
    background: url(../../static/images/sprites/Pages_d.png) no-repeat center center;
}
.uPages {
    font-size: 12px;
    line-height: 24px;
    cursor: default;
}
.uslp {
    width:100%;
    top:25px;
    position: absolute;
    border: 1px solid #e3e3e3;
    border-radius: 3px;
    background-color: #fff;
}
.uslp>div {
    text-align: left;
    padding-left: 5px;
    cursor: default;
    line-height: 18px;
}
.uslp>div:hover {
    background-color: #f1f1f1;
}
.uslp .selected {
    background-color: #e7e7e7;
}
.uPages .uTotal,
.uPages .ctrls,
.uPages .ctrls>div,
.uPages .ctrl>span,
.uPages .pgo {
    display: inline-block;
    vertical-align: middle;
    *display: inline;
    *zoom: 1;
}
.uPages .uTotal {
    margin-right: 20px;
}
.uPages .ctrls .prev,
.uPages .ctrls .next,
.uPages .ctrl>span {
    height: 24px;
}
.uPages .ctrls .prev,
.uPages .ctrls .next {
    width: 20px;
    cursor: pointer;
}
.uPages .ctrls .prev.disabled,
.uPages.disabled .ctrls .prev {
    cursor: default;
}
.uPages .ctrls .next.disabled,
.uPages.disabled .ctrls .next {
    cursor: default;
}
.uPages .ctrl {
    padding-left: 4px;
}
.uPages .ctrl>span {
    min-width: 2.5em;
    margin-right: 4px;
    text-align: center;
    color: #7B8EA5;
    border-radius: 12px;
}
.uPages .ctrl .selected,
.uPages .ctrl .uPage:hover {
    color: #fff;
    background-color: #7B8EA5;
}
.uPages .ctrl .uPage {
    cursor: pointer;
}
.uPages.disabled .ctrl .uPage {
    cursor: default;
    color: #bbb !important;
}
.uPages.disabled .ctrl .uPage.selected {
    color: #fff !important;
}
.uPages .pgo>input {
    box-sizing: border-box;
    color: #c6c6c6;
    width: 48px;
    height: 24px;
    margin: 0 5px;
    padding: 0 5px;
    text-align: center;
    border: 1px solid #dfdfdf;
    border-radius: 5px;
}
.uPages.disabled .pgo>input {
    color: #bbb !important;
}
.uPages .pgo>span.trigger {
    display: inline-block;
    width: 32px;
    line-height: 22px;
    height: 22px;
    cursor: pointer;
    vertical-align: middle;
    border: 1px solid #7B8EA5;
    border-radius: 12px;
    background: #7B8EA5 url(../../static/images/sprites/page-go.png) center 0px no-repeat;
}
.uPages.disabled .pgo .trigger {
    cursor: default;
    background-position: center -35px;
}
.uPages .ctrls .next {
    background: url(../../static/images/sprites/page-right-arrowR.png) no-repeat center;
}

.uPages .ctrls .prev {
    background: url(../../static/images/sprites/page-left-arrowL.png) no-repeat center;
}
}
</style>
