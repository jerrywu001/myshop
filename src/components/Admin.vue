<template>
	<div class="admin">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 入库管理
            </BreadcrumbItem>
        </Breadcrumb>
        <div class="form">
            <Divider orientation="left">基本信息</Divider>
            <div class="form-item">
                <div class="tag">商品名称：</div>
                <div class="content">
                    <Input v-model.trim="name" placeholder="请输入商品名称"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">商品货号：</div>
                <div class="content">
                    <Input v-model.trim="goodId" placeholder="请输入商品货号"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">进货价格：</div>
                <div class="content">
                    <InputNumber v-model.trim="prevPrice" :min="0" placeholder="请输入进货价格"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">吊牌价格：</div>
                <div class="content">
                    <InputNumber v-model.trim="price" :min="0" @on-change="setSalePrice" placeholder="请输入吊牌价格"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">折后价格：</div>
                <div class="content">
                    <InputNumber v-model.trim="salePrice" :min="0" disabled placeholder="请输入折后价格"/>
                </div>
            </div>
            <Divider orientation="left">颜色信息</Divider>
            <Button type="dashed" :disabled="propsLength > 4" @click="addOneColor">添加颜色</Button>
            <div class="color-warp rel">
                <div class="color-item rel" v-for="item in props" :key="item.id">
                    <!-- 添加尺码 -->
                    <a class="add-size" title="添加尺码" @click="addOneSize(item)"><Icon type="ios-add-circle" /></a>
                    <!-- 删除颜色 -->
                    <Button
                        v-if="propsLength > 1"
                        type="default"
                        title="删除颜色"
                        class="delete-color"
                        shape="circle"
                        icon="md-close"
                        @click="deleteOneColor(item);">
                    </Button>
                    <!-- 颜色 -->
                    <div class="tag title abs">颜色：</div>
                    <div class="box rel" style="width: 300px;">
                        <Input v-model.trim="item.color" placeholder="请输入颜色"/>
                    </div>
                    <!-- 尺码 -->
                    <div class="color-size rel" v-for="(s, index) in item.size" :key="index">
                        <div class="size-li rel">
                            <div class="tag abs">尺码：</div>
                            <div class="box rel">
                                <Input v-model.trim="s.value" placeholder="请输入尺码"/>
                            </div>
                        </div>
                        <div class="size-li rel">
                            <div class="tag abs">件数：</div>
                            <div class="box rel">
                                <InputNumber v-model.trim="s.count" :min="0" placeholder="请输入件数"/>
                            </div>
                        </div>
                        <div v-if="item.size.length > 1" class="size-li rel">
                            <div class="box rel">
                                <a class="delete" @click="deleteOneSize(s, item);">删除</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Button type="primary" size="large" style="width: 100px;left: 669px;" @click="save">提交</Button>
	</div>
</template>

<script>
export default {
    name: 'admin',
    data() {
        return {
            name: '',
            goodId: '',
            prevPrice: 0,
            prevTotal: 0,
            price: 0,
            salePrice: 0,
            props: [],
        };
    },
    computed: {
        propsLength() {
            return this.props.length;
        },
    },
    methods: {
        getId() {
            return new Date().getTime().toString();
        },
        /**
         * 设置折后价格
         */
        setSalePrice() {
            this.salePrice = this.price / 2;
        },
        /**
         * 添加一个颜色属性
         */
        addOneColor() {
            this.props.push({
                id: this.getId(),
                color: '',
                size: [
                    {
                        value: '',
                        count: 0,
                    },
                ],
            });
        },
        /**
         * 删除一个颜色属性
         */
        deleteOneColor(item) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认删除该颜色属性？</p>',
                onOk: () => {
                    this.props = _us.without(this.props, item);
                },
            });
        },
        /**
         * 添加一个尺码属性
         */
        addOneSize(item) {
            item.size.push(
                {
                    id: this.getId(),
                    value: '',
                    count: 0,
                }
            );
            console.log(this.props);
        },
        /**
         * 删除一个尺码属性
         */
        deleteOneSize(size, item) {
            item.size = _us.without(item.size, size);
        },
        /**
         * 获取提交参数
         */
        getParams() {
            const params = {
                name: this.name,
                goodId: this.goodId,
                prevPrice: this.prevPrice,
                prevTotal: this.prevTotal,
                price: this.price,
                salePrice: this.salePrice,
                props: this.props,
            };
            return params;
        },
        /**
         * 是否存在不完整的颜色信息
         */
        hasInValidColor() {
            let flag = false;
            for (const v of this.props) {
                if (!v.color) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        /**
         * 是否存在不完整的尺码信息
         */
        hasInValidSize() {
            let flag = false;
            for (const v of this.props) {
                if (flag) {
                    break;
                }
                for (const s of v.size) {
                    if (!s.value || !s.count) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        },
        /**
         * 提交
         */
        save() {
            if (!this.name && !this.goodId) {
                this.$Notice.warning({
                    title: '商品名称和商品货号至少填写一个',
                });
                return;
            }
            if (this.salePrice < this.prevPrice + 10) {
                this.$Notice.warning({
                    title: '真实售卖价格不能低于“进货价格 + 10元”',
                });
                return;
            }
            if (this.hasInValidColor()) {
                this.$Notice.warning({
                    title: '颜色信息不完整',
                });
                return;
            }
            if (this.hasInValidSize()) {
                this.$Notice.warning({
                    title: '尺码信息不完整',
                });
                return;
            }
            const params = this.getParams();
            this.$ajax.save(params).then((rsp) => {
                console.log(rsp);
            });
            // 保存成功
            this.clear();
            this.$Notice.success({
                title: '保存成功',
            });
            console.log(params);
        },
        clear() {
            this.name = '';
            this.goodId = '';
            this.prevPrice = 0;
            this.price = 0;
            this.salePrice = 0;
            this.props = [];
        },
    },
    mounted() {
        window.onbeforeunload = function () {
            return '关闭提示';
        };
    },
};

</script>

<style lang="scss">
@import '../scss/admin.scss';

</style>
