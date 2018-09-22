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
                    <InputNumber v-model.trim="prevPrice" :min="0" laceholder="请输入进货价格"/>
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
            <Button type="default" @click="addColor">添加颜色</Button>
        </div>
        <Button type="primary" @click="save">提交</Button>
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
            price: 0,
            salePrice: 0,
        };
    },
    methods: {
        setSalePrice() {
            this.salePrice = this.price / 2;
        },
        addColor() {

        },
        getParams() {
            const params = {
                name: this.name,
                goodId: this.goodId,
                prevPrice: this.prevPrice,
                price: this.price,
                salePrice: this.salePrice,
            };
            return params;
        },
        save() {
            if (!this.name && !this.goodId) {
                this.$Message.warning('商品名称和商品货号至少填写一个');
                return;
            }
            if (this.salePrice < this.prevPrice + 10) {
                this.$Notice.warning({
                    title: '真实售卖价格不能低于“进货价格 + 10元”'
                });
                return;
            }
            const params = this.getParams();
            console.log(params);
        },
    },
    created() {
    },
    mounted() {
    }
};

</script>

<style lang="scss">
.admin {
    .ivu-btn {
        position: relative;
        left: 71px;
    }
    .ivu-divider {
        margin: 30px 8px;
    }
}

.form {
    margin: 25px 0;
    font-size: 14px;
}

.form-item {
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
    .tag {
        position: absolute;
        top: 7px;
        left: 0;
        width: 90px;
        text-align: right;
        padding-right: 12px;
    }
    .content {
        margin-left: 90px;
        width: 680px;
    }
    .ivu-input-number {
        width: 680px;
    }
}
</style>
