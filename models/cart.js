//logic for addding item to the cart
module.exports = function Cart(oldCart){
this.items = oldCart.items || {};
this.totalQty = oldCart.totalQty || 0;
this.totalPrice = oldCart.totalPrice || 0;

this.add=function(item,id){
    let storedItem = this.items[id];
if(!storedItem){
    storedItem = this.items[id] = {item,Qty:0,price:0};
}
storedItem.Qty++;
storedItem.price = storedItem.item.price * storedItem.Qty;
this.totalQty++;
this.totalPrice += storedItem.item.price
}
this.reduceByOne= function(id) {
    this.items[id].Qty--;
    this.items[id].price -=this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -=this.items[id].item.price;
    if(this.items[id].Qty <=0){
    delete this.items[id];
    }
    }
    this.removeAll = function(id){
        this.totalQty -=this.items[id].Qty;
        this.totalPrice -=this.items[id].price
        delete this.items[id];
    }
this.genrateArray = function(){
    let arr =[];
    for(let id in this.items){
  arr.push(this.items[id]);
    }
    return arr;
}
};
