<template>
  <div>
    <!-- 商品分类三级列表 -->
    <typeNav />
    <div class="main">
      <div class="py-container">
        <!--bread(面包屑，带有x的结构的)-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName }}<i @click="removecategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removekeyword">×</i>
            </li>
            <!-- 品牌信息的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}<i @click="removetrademark">×</i>
            </li>
            <!-- 属性值信息的面包屑 -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @tradmarkInfo="tradmarkInfo" @arrtInfo="arrtInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 价格结构 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne && isAsc">↑</span><span v-show="isOne && isDesc">↓</span></a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo && isAsc">↑</span><span v-show="isTwo && isDesc">↓</span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售的产品的列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转时要带参数 -->
                    <router-link :to="`/detail/${good.id}`">
                      <!-- 懒加载报错，还没有解决，目前先不使用懒加载 -->
                      <!-- <img v-lazy="good.defaultImg" /> -->
                      <img :src="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器(测试分页器阶段，数据先写死，等写完之后再进行替换) -->
          <Pagenation
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continue="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 带给服务器的参数
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryName: "", //商品的名字
        keyword: "", //用户搜索的关键字
        props: [], //商品属性的搜索条件
        trademark: "", //品牌的搜索条件
        order: "1:desc", //排序的参数 【默认初始值:1:desc】
        pageNo: 1, //当前分页器的页码  【默认初始值:1】
        pageSize: 3, //代表当前一页显示几条数据 【默认初始值:10】
      },
    };
  },
  // 在组件挂载完毕之前执行一次【先于mounted执行】
  beforeMount() {
    // 在发请求之前，把接口需要的数据进行整理
    // console.log("@",this.$route.query,"#",this.$route.params);   // 找bug时的测试代码...
    // Object.assign  用于合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // console.log("发请求之前",this.searchParams);  // 测试代码
  },
  // 组件挂载完毕执行一次【只会执行一次】
  mounted() {
    // 在发送请求之前带给服务器参数【searchParams参数发生变化，将数据带给服务器】
    this.getData();
  },
  methods: {
    // 向服务器发送请求获取search模块的数据(根据参数的不同而返回不同的数据进行展示)
    // 把请求封装为函数，需要发送请求时调用函数即可
    getData() {
      // 派发action
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 删除面包屑分类的名字
    removecategoryName() {
      // 把带给服务器的参数置空
      // 带给服务器的参数是可有可无的，如果属性值为空，还是会把相应的字段带给服务器
      // 但是设置为undefined后，当前这个字段不会自动带给服务器
      this.searchParams.categoryName = undefined; // 设置为undefined，不会将参数带给服务器
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 再次发请求
      this.getData();
      // 地址栏也需要修改,进行路由的跳转(老师说这是一个骚操作)
      // 严谨：本意是删除query参数，但是如果路径中出现params参数不应该删除，路由跳转的时候应该一并带过去
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    // 删除关键字
    removekeyword() {
      // 置空keyword
      this.searchParams.keyword = undefined;
      // 再次发请求
      this.getData();
      // 通知header组件清除输入框中的keyword
      this.$bus.$emit("clear");
      // 进行路由跳转
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    // 删除品牌的关键字
    removetrademark() {
      // 将品牌信息置空
      this.searchParams.trademark = undefined;
      // 再次发请求
      this.getData();
    },
    // 删除属性值的回调
    removeAttr(index) {
      // 再次整理参数
      this.searchParams.props.splice(index, 1);
      // 再次发请求
      this.getData();
    },
    // 自定义事件的回调(点击“品牌”)
    tradmarkInfo(trademark) {
      // 整理参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 再次发请求，获取search模块的数据进行展示
      this.getData();
    },
    // 自定义事件的回调(点击"属性”)
    arrtInfo(attr, attrValue) {
      // 整理参数
      // 参数的格式
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 数组去重！！！！！
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
      }
      // 再次发送请求
      this.getData();
    },
    // 排序的回调
    changeOrder(flag) {
      // flag 形参，是标记，代表用户点击的是“综合”(1)还是“价格”(2),用户点击时传过来的
      let originOrder = this.searchParams.order;
      // 这里获取到的是最开始的状态
      let originFlag = this.searchParams.order.split(":")[0];
      let originSort = this.searchParams.order.split(":")[1];
      // 准备一个新的order值
      let newOrder = "";
      // 点击的是“综合”
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSort == "desc" ? "asc" : "desc"}`;
      } else {
        // 点击的是“价格”
        newOrder = `${flag}:${"desc"}`;
      }
      // 修改searchParams中order的值
      this.searchParams.order = newOrder;
      // 再次发送请求
      this.getData();
    },
    // 自定义事件的回调函数，获取子组件传过来的页码
    getPageNo(pageNo) {
      // 再次整理参数
      this.searchParams.pageNo = pageNo;
      // 再次发请求
      this.getData();
    },
  },
  computed: {
    // mapGetters 里面的写法，传递的是数组，因为getters计算是没有划分模块的
    ...mapGetters(["goodsList"]),
    // 获取Search模块中的数据总数
    ...mapState({
      total: (state) => state.search.serachList.total,
    }),
    // 用于动态地给“销量”和“价格”绑定高亮的样式
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    // 用于展示向下和向上的箭头
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
  },
  // 数据监听，监听组件实例身上的属性的属性值的变化 如果发生变化，再次发请求
  watch: {
    $route(newValue, oldVaule) {
      // 再次发请求之前需要再次整理参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // console.log(this.searchParams);  // 测试代码
      // 再次发起请求
      this.getData();
      // 每一次请求完毕，应该把相应的1、2、3级分类id置空，让其接收下一次响应的1、2、3级id
      // 分类名与关键字不用清理，因为每一次路由发生变化时，都会给他赋予新的数据
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // console.log(this.searchParams);
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>