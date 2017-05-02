var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by altingfest on 15/04/17.
 */
define("ts/BasicSlider", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var BasicSlider = (function () {
        function BasicSlider() {
            this.defs = 0;
            this.opts = 0;
        }
        return BasicSlider;
    }());
    exports.BasicSlider = BasicSlider;
});
/**
 * Created by altingfest on 15/04/17.
 */
define("app", ["require", "exports", "ts/BasicSlider"], function (require, exports, BasicSlider_1) {
    "use strict";
    exports.__esModule = true;
    var DisplaceSlider = (function (_super) {
        __extends(DisplaceSlider, _super);
        function DisplaceSlider() {
            var _this = _super.call(this) || this;
            _this.scrollHandler = 0;
            return _this;
        }
        return DisplaceSlider;
    }(BasicSlider_1.BasicSlider));
});
