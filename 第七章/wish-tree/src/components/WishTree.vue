<template>
  <div class="gb" :style="bg">
    <div class="title">许愿树</div>
    <div class="wishing">
        <el-button type="text" @click="dialogVisible = true" class="wishing-btn">我<br>要<br>许<br>愿</el-button>
    </div>
    <div v-for="w in wishes">
        <img src="../assets/wish.gif" 
             class="wish-img" 
             v-bind:style="{ left: w.left + 'px', top: w.top + 'px' }"
             >
        <div class="wish-text" v-bind:style="{ left: w.left + 3 + 'px', top: w.top + 2 + 'px' }"
             @click="w.show_detail = true"> 
            <p>{{ w.content.substring(0,2) }}</p>
        </div>
        <el-dialog
            :title="w.nickname"
            :visible.sync="w.show_detail"
            width="50%">
            <div>{{ w.content }}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="w.show_detail = false">取 消</el-button>
                <el-button type="success" @click="w.show_detail = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    <el-dialog
        title="请输入你的愿望"
        :visible.sync="dialogVisible"
        width="60%">
        <el-form>
            <el-form-item label="昵称">
              <el-input v-model="wish.nickname" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="愿望">
              <el-input v-model="wish.content" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="success" @click="submitWish">确 定</el-button>
          </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'WishTree',
  data() {
    return {
        bg: {
            backgroundImage: "url(" + require("../assets/background.jpg") + ") ",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100%",
        },
        dialogVisible: false,
        wish: {
            nickname: "",
            content: "",
        },
        wishes: [],
        index: 0
    }
  },
  methods: {
      submitWish() {
        // this.$root.newWish(this.index, this.wish.nickname, this.wish.content);
        this.index += 1;
        let left = 130;
        let top = 130;
        let right = 630;
        let bottom = 330;

        
        this.wishes.push({
            nickname: this.wish.nickname,
            content: this.wish.content,
            left: Math.random() * (right - left) + left, 
            top: Math.random() * (bottom - top) + top,
            show_detail: false
        })
        this.wish.nickname = "";
        this.wish.content = "";
        this.dialogVisible = false;
      },
      showWish() {
          console.log('ddd');
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title {
        color: #fafafa;
        letter-spacing: 0;
        text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135;
        float: left;
        font-size: 24px;
        padding: 15px 28px;
        width: 24px; 
        word-wrap: break-word;
    }
    .wishing {
        float: right;
        font-size: 24px;
        padding: 15px 28px;
        word-wrap: break-word;
    }
    .wish-img {
        position: absolute;
    }
    .wish-text {
        position: absolute;
        color: white;
        width: 15px; 
        font-size: 15px; 
        word-wrap: break-word;
    }
    .wishing-btn {
        color: #fff;
        background-color: #d9534f;
        border-color: #d43f3a;
    }
</style>
