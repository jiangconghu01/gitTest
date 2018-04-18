function BinarySearchThree(){
    var Node=function(key){
        this.key=key;
        this.left=null;
        this.right=null;
    }
    var root=null;
    var insertNode=function(node,newNode){
        if(newNode.key<node.key){
            if(node.left===null){
                node.left=newNode;
            }else{
                insertNode(node.left,newNode);
            }
        }else{
            if(node.right===null){
                node.right=newNode;
            }else{
                insertNode(node.right,newNode)
            }
        }
    }
    var inOrderTraverseNode=function(node,callback){
        if(node!==null){
            inOrderTraverseNode(node.left,callback);
            callback(node.key);
            inOrderTraverseNode(node.right,callback);
        }

    }
    var preOrderTraverseNode=function(node,callback){
        if(node!==null){
            callback(node.key);
            preOrderTraverseNode(node.left,callback);
            preOrderTraverseNode(node.right,callback);
        }

    }
    var postOrderTraverseNode=function(node,callback){
        if(node!==null){
            postOrderTraverseNode(node.left,callback);
            postOrderTraverseNode(node.right,callback);
            callback(node.key);
        }

    }
    this.insert=function(key){
        var newNode=new Node(key);
        if(root===null){
            root =newNode;
        }
        else{
            insertNode(root,newNode);
        }
    }
    this.inOrderTraverse=function(callback){
        inOrderTraverseNode(root,callback);
    }
    this.preOrderTraverse=function(callback){
        preOrderTraverseNode(root,callback);
    }
    this.postOrderTraverse=function(callback){
        postOrderTraverseNode(root,callback);
    }
    var minNode=function(node){
        if(node){
            while(node && node.left!==null){
                node=node.left;
            }
            return node.key;
        }
        return null;
    }
    var maxNode=function(node){
        if(node){
            while(node && node.right!==null){
                node=node.right;
            }
            return node.key;
        }
        return null;
    }
    var searchNode=function(node,key){
        if(node===null){
            return false;
        }
        if(key<node.key){           //类似二分查找
            return searchNode(node.left,key);
        }else if(key>node.key){
            return searchNode(node.right,key);
        }else{
            return true;
        }
    }
    var findMinNode=function(node){
        if(node){
            while(node && node.left!==null){
                node=node.left;
            }
            return node;
        }   
    }
    var removeNode=function(node,key){
        if(node===null){
            return null;
        }
        if(key<node.key){
            node.left=removeNode(node.left,key);
            return node;
        }else if(key>node.key){
            node.right=removeNode(node.right,key);
            return node;
        }else{
            //一个叶节点
            if(node.left===null&&node.right===null){
                node=null
                return node;
            }
            //只有一个子节点
            if(node.left===null){
                node=node.left;
                return node;
            }
            if(node.right===null){
                node=node.right;
                return node;
            }
            //有两个子节点
            var aux=findMinNode(node.right);
            node.key=aux.key;
            node.right=removeNode(node.right,aux.key);
            return node;
        }
    }
    this.min=function(){
        return minNode(root);
    }
    this.max=function(){
        return maxNode(root);
    }
    this.search=function(key){//查找树中树中是否存在该key值，如果存在返回TRUE
        return searchNode(root,key);
    }
    this.remove=function(key){
        root=removeNode(root,key);
    }
    
}

var tree=new BinarySearchThree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(20);
tree.insert(18);
tree.insert(25);
tree.insert(6);
tree.inOrderTraverse(function(val){console.log(val)});
var arr=[];
tree.inOrderTraverse(function(val){arr.push(val);});
console.log(arr)
var arr=[];
tree.preOrderTraverse(function(val){arr.push(val);});
console.log(arr)
var arr=[];
tree.postOrderTraverse(function(val){arr.push(val);});
console.log(arr)
console.log(tree.min(),tree.max());
console.log(tree.search(9));
console.log(tree.search(19));


