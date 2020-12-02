const { ccclass, property } = cc._decorator;

@ccclass
export default class FogRender extends cc.Component {
    @property(cc.Float)
    radius: number = 100;
    @property(cc.Mask)
    mask: cc.Mask = null;

    graphics: cc.Graphics = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true; // 开启了物理引擎
        this.graphics = (this.mask as any)._graphics;
        this.initMoveControl();
        setTimeout(this.draw.bind(this), 1e3);
    }

    initMoveControl() {
        cc.find('Canvas').on(cc.Node.EventType.TOUCH_MOVE, this.move.bind(this));
    }

    draw() {
        this.graphics.clear();
        let lightP = this.node.getPosition();
        for (let i = 0; i < 180; i++) {
            let deg = i / 180 * 2 * Math.PI;
            let x = lightP.x + this.radius * Math.cos(deg);
            let y = lightP.y + this.radius * Math.sin(deg);
            // console.log(x,y)
            let rs = cc.director.getPhysicsManager().rayCast(
                cc.find('Canvas').convertToWorldSpaceAR(lightP),
                cc.find('Canvas').convertToWorldSpaceAR(cc.v2(x, y)),
                cc.RayCastType.Closest);
            let drawX, drawY;
            if (rs && rs.length && rs[0].collider.node.group == 'Wall') {
                let p = cc.find('Canvas').convertToNodeSpaceAR(rs[0].point);
                drawX = p.x;
                drawY = p.y;
            } else {
                drawX = x;
                drawY = y;
            }
            if (i == 0) {
                this.graphics.moveTo(drawX, drawY);
            }
            this.graphics.lineTo(drawX, drawY);
        }
        this.graphics.fill();
    }
    move(e) {
        let p = cc.find('Canvas').convertToNodeSpaceAR(e.touch._point);
        this.node.setPosition(p);
        this.draw();
    }
}
