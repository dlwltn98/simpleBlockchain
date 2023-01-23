import crypto from "crypto";


interface BlockShape {

    hash: string;       // 그 블록의 고유 서명 같은 것, prevHash,height,data 값을 이용해 계산됨
    prevHash: string;   // 이전 해쉬값
    height: number;     // 1,2,3,4,5 같이 블록의 위치를 표시해주는 숫자
    data: string;       // 블록이 보호할 데이터
}

class Block implements BlockShape {

    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        // hash 변수 초기화
       this.hash = Block.calculateHash(prevHash, height, data);
    }

    // hash 값 계산 함수
    static calculateHash(prevHash: string, height: number, data: string) {
        
        const toHash = `${prevHash}${height}${data}`;   // hash 값

        // NodeJS 패키지중 하나인 crypto 이용해 해쉬값 만든 후 반환
        return crypto.createHash("sha256").update(toHash).digest("hex");
    }
}

class Blockchain {

    private blocks: Block[];
    constructor() {
        this.blocks = [];
    }

    // 이전 해쉬값을 불러 옴
    private getPrevHash() {

        if(this.blocks.length === 0) return "";      // 첫번째 해쉬가 없는 경우
        return this.blocks[this.blocks.length - 1].hash;  // 아닌 경우 마지막 블럭의 해쉬값 리턴
    }

    // 새로운 블럭 추가
    public addBlock(data: string) {

        // 새로운 블럭 생성
        const newBlock = new Block(this.getPrevHash(), this.blocks.length + 1, data);

        // 새로 생성한 블럭을 blocks 배열에 넣어주면 됨
        this.blocks.push(newBlock);
    }

    // 블록에 접근할 수 있는 함수
    public getBlocks() {
        // 보안상 문제 있음
        //return this.blocks;   

        // 블록은 다 들어있지만 새로운 배열임, 배열 안에 있는 데이터를 가진 새로운 배열을 반환
        return [...this.blocks];
    }
}


// 새로운 블록체인 생성
const blockchain = new Blockchain();

blockchain.addBlock("First One");
blockchain.addBlock("Second One");
blockchain.addBlock("Third One");

// getBlocks()에서 private인 blocks를 반환해서 보안상 문제가 생김
blockchain.getBlocks().push(new Block("xxxxxxxx", 11111, "HACKED"));

console.log(blockchain.getBlocks());