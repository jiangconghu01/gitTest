
function LinkList(){
    let Node=function(element){
        this.element=element;
        this.next=null;
    }
    let length=0;
    let head=null;
    function getInt(number,length){
        return (typeof number==='number' && !isNaN(number) && (number>=0 && number<=length)) ? Math.floor(number) : new Error(`${number} is not a correct type of input`);
    }   
    this.append=function(element){
        let node=new Node(element);
        let current;
        if(head===null){
            head=node;
        }else{
            current=head;
            while(current.next){
                current=current.next;
            }
            current.next=node;
        }
        length++;
    }
    this.insert=function(position,element){
        let pos=getInt(position,length),
        node=new Node(element),
        current=head,
        previous;
        index=0;
        if(pos instanceof Error){
            throw pos;
        }
        if(pos===0){
            head=node;
        }else{
            while(index++<pos){
                previous=current;
                current=current.next;
            }
           node.next=current;
           previous.next=node;
            length++;
        }
        return true;
    }
    this.removeAt=function(position){
        let pos=getInt(position,length),
        current=head,
        previous,
        index=0;
        if(pos instanceof Error){
            throw pos;
        }
        if(pos===0){
            node.next=head;
            head=node;
        }else{
            while(index++<pos){
                previous=current;
                current=current.next;
            }
            previous.next=current.next;//将pre前一项的next和当前项curret的next连接起来，跳过current，从而删除它
            length--;           
        }
        return true;
    }
    this.remove=function(element){

    }
    this.indexOf=function(element){
        let current=head,
        index=1;
        while(current){
            if(element===current.element){
                return index;
            }
            current=current.next;
            index++;
        }
        return -1;
    }
    this.isEmpty=function(){
        return length===0;
    }
    this.size=function(){
        return length;
    }
    this.getHead=function(){
        return head;
    }
    this.toString=function(){
        let current=head,
        string='',
        index=1;
        while(current){
            string+=`${index}:${current.element}\n`;
            current=current.next;
            index++;
        }
        return string;
    }
}

let list=new LinkList();
for(let i=0;i<10;i++){
    list.append('child'+i)
}
console.log(list.toString())
console.log(list.indexOf('child5'))
list.removeAt(3);
list.removeAt('8');
console.log(list.toString());
list.insert(3,'test3');
console.log(list.toString());
