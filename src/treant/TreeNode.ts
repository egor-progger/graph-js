/**
 * TreeNode constructor.
 * @param {object} nodeStructure
 * @param {number} id
 * @param {number} parentId
 * @param {Tree} tree
 * @param {number} stackParentId
 * @constructor
 */

import { injectable } from "inversify";
import { UTIL } from "./Util";
import { Tree } from "./Tree";
import $ from "jquery";

@injectable()
export class TreeNode {
  protected util: UTIL = new UTIL();

  id: number;
  parentId: number;
  treeId: number;
  prelim: number;
  modifier: number;
  leftNeighborId: number | null;
  rightNeighborId: number | null;
  stackParentId: any;
  stackParent: boolean = undefined;
  pseudo: any;
  meta: string;
  image: string;
  link: any;
  connStyle: any;
  connector: any;
  drawLineThrough: any;
  collapsable: boolean;
  collapsed: boolean;
  text: any;
  nodeInnerHTML: any;
  nodeHTMLclass: string;
  nodeHTMLid: number;
  children: any;
  width: number;
  height: number;
  X: number;
  Y: number;
  lineThroughMe: any;
  nodeDOM: any;
  hidden: boolean;
  positioned: any;
  style: any;
  stackChildren: any;

  CONFIG = {
    nodeHTMLclass: "node",
  };

  constructor(
    public tree: Tree
  ) {
    // console.log('TreeNode constructor');
    // console.log(this.tree);
    // console.log(new jQuery().instance);
    // console.log($);
  }

  init(
    nodeStructure: any,
    id: number,
    parentId: number,
    tree: any,
    stackParentId: number | null) {
    return this.reset(nodeStructure, id, parentId, tree, stackParentId);
  }

  /**
   * @param {object} nodeStructure
   * @param {number} id
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @returns {TreeNode}
   */
  reset(
    nodeStructure: any,
    id: number,
    parentId: number,
    tree: any,
    stackParentId: number | null
  ) {
    this.id = id;
    this.parentId = parentId;
    this.treeId = tree.id;

    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighborId = null;

    this.stackParentId = stackParentId;

    // pseudo node is a node with width=height=0, it is invisible, but necessary for the correct positioning of the tree
    this.pseudo = nodeStructure === "pseudo" || nodeStructure["pseudo"]; // todo: surely if nodeStructure is a scalar then the rest will error:

    this.meta = nodeStructure.meta || {};
    this.image = nodeStructure.image || null;

    this.link = this.util.createMerge(
      tree.CONFIG.node.link,
      nodeStructure.link
    );

    this.connStyle = this.util.createMerge(
      tree.CONFIG.connectors,
      nodeStructure.connectors
    );
    this.connector = null;

    this.drawLineThrough =
      nodeStructure.drawLineThrough === false
        ? false
        : nodeStructure.drawLineThrough || tree.CONFIG.node.drawLineThrough;

    this.collapsable =
      nodeStructure.collapsable === false
        ? false
        : nodeStructure.collapsable || tree.CONFIG.node.collapsable;
    this.collapsed = nodeStructure.collapsed;

    this.text = nodeStructure.text;

    // '.node' DIV
    this.nodeInnerHTML = nodeStructure.innerHTML;
    this.nodeHTMLclass =
      (tree.CONFIG.node.HTMLclass ? tree.CONFIG.node.HTMLclass : "") + // globally defined class for the nodex
      (nodeStructure.HTMLclass ? " " + nodeStructure.HTMLclass : ""); // + specific node class

    this.nodeHTMLid = nodeStructure.HTMLid;

    this.children = [];
    console.log(`this.image === 'img/lana.png'`);
    console.log(this.image === 'img/lana.png');
    console.log(`this.collapsed`);
    console.log(this.collapsed);

    return this;
  }

  /**
   * @returns {object}
   */
  getTreeConfig() {
    return this.getTree().CONFIG;
  }

  /**
   * @returns {NodeDB}
   */
  getTreeNodeDb() {
    return this.getTree().getNodeDb();
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  lookupNode(nodeId: number) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * @returns {Tree}
   */
  getTree() {
    return this.tree;
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  dbGet(nodeId: number) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * Returns the width of the node
   * @returns {float}
   */
  size() {
    // console.log('size begin');
    const orientation = this.getTreeConfig().rootOrientation;

    if (this.pseudo) {
      // prevents separating the subtrees
      // console.log(-1 * this.getTreeConfig().subTeeSeparation);
      // console.log('size end');
      return -1 * this.getTreeConfig().subTeeSeparation;
    }

    if (orientation === "NORTH" || orientation === "SOUTH") {
      // console.log(this.width);
      // console.log('size end');
      return this.width;
    } else if (orientation === "WEST" || orientation === "EAST") {
      // console.log(this.height);
      // console.log('size end');
      return this.height;
    }
    // console.log(0);
    // console.log('size end');
    return 0;
  }

  /**
   * @returns {number}
   */
  childrenCount() {
    return this.collapsed || !this.children ? 0 : this.children.length;
  }

  /**
   * @param {number} index
   * @returns {TreeNode}
   */
  childAt(index: number): TreeNode {
    return this.dbGet(this.children[index]);
  }

  /**
   * @returns {TreeNode}
   */
  firstChild() {
    return this.childAt(0);
  }

  /**
   * @returns {TreeNode}
   */
  lastChild(): TreeNode {
    return this.childAt(this.children.length - 1);
  }

  /**
   * @returns {TreeNode}
   */
  parent() {
    return this.lookupNode(this.parentId);
  }

  /**
   * @returns {TreeNode}
   */
  leftNeighbor() {
    if (this.leftNeighborId) {
      return this.lookupNode(this.leftNeighborId);
    }
  }

  /**
   * @returns {TreeNode}
   */
  rightNeighbor() {
    if (this.rightNeighborId) {
      return this.lookupNode(this.rightNeighborId);
    }
  }

  /**
   * @returns {TreeNode}
   */
  leftSibling() {
    const leftNeighbor = this.leftNeighbor();
    if (leftNeighbor && leftNeighbor.parentId === this.parentId) {
      return leftNeighbor;
    }
  }

  /**
   * @returns {TreeNode}
   */
  rightSibling() {
    var rightNeighbor = this.rightNeighbor();

    if (rightNeighbor && rightNeighbor.parentId === this.parentId) {
      return rightNeighbor;
    }
  }

  /**
   * @returns {number}
   */
  childrenCenter() {
    // console.log('childrenCenter begin');
    var first = this.firstChild(),
      last = this.lastChild();
    // console.log(`first.prelim ${first.prelim}`);
    // console.log(`first`);
    // console.log(first);
    // console.log(`last`);
    // console.log(last);
    // console.log(`last.prelim ${last.prelim}`);
    // console.log(`last.size() ${last.size()}`);
    // console.log('childrenCenter end');
    return first.prelim + (last.prelim - first.prelim + last.size()) / 2;
  }

  /**
   * Find out if one of the node ancestors is collapsed
   * @returns {*}
   */
  collapsedParent(): TreeNode | boolean {
    var parent = this.parent();
    if (!parent) {
      return false;
    }
    if (parent.collapsed) {
      return parent;
    }
    return parent.collapsedParent();
  }

  /**
   * Returns the leftmost child at specific level, (initial level = 0)
   * @param level
   * @param depth
   * @returns {*}
   */
  leftMost(level: number, depth: number): TreeNode | null {
    if (level >= depth) {
      return this;
    }
    if (this.childrenCount() === 0) {
      return null;
    }

    for (var i = 0, n = this.childrenCount(); i < n; i++) {
      var leftmostDescendant = this.childAt(i).leftMost(level + 1, depth);
      if (leftmostDescendant) {
        return leftmostDescendant;
      }
    }
  }

  // returns start or the end point of the connector line, origin is upper-left
  connectorPoint(startPoint: boolean) {
    var orient = this.getTree().CONFIG.rootOrientation,
      point: any = {};

    if (this.stackParentId) {
      // return different end point if node is a stacked child
      if (orient === "NORTH" || orient === "SOUTH") {
        orient = "WEST";
      } else if (orient === "EAST" || orient === "WEST") {
        orient = "NORTH";
      }
    }

    // if pseudo, a virtual center is used
    if (orient === "NORTH") {
      point.x = this.pseudo
        ? this.X - this.getTree().CONFIG.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y + this.height : this.Y;
    } else if (orient === "SOUTH") {
      point.x = this.pseudo
        ? this.X - this.getTree().CONFIG.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y : this.Y + this.height;
    } else if (orient === "EAST") {
      point.x = startPoint ? this.X : this.X + this.width;
      point.y = this.pseudo
        ? this.Y - this.getTree().CONFIG.subTeeSeparation / 2
        : this.Y + this.height / 2;
    } else if (orient === "WEST") {
      point.x = startPoint ? this.X + this.width : this.X;
      point.y = this.pseudo
        ? this.Y - this.getTree().CONFIG.subTeeSeparation / 2
        : this.Y + this.height / 2;
    }
    return point;
  }

  /**
   * @returns {string}
   */
  pathStringThrough() {
    // get the geometry of a path going through the node
    var startPoint = this.connectorPoint(true),
      endPoint = this.connectorPoint(false);

    return [
      "M",
      startPoint.x + "," + startPoint.y,
      "L",
      endPoint.x + "," + endPoint.y,
    ].join(" ");
  }

  /**
   * @param {object} hidePoint
   */
  drawLineThroughMe(hidePoint: any): void {
    // hidepoint se proslijedjuje ako je node sakriven zbog collapsed
    var pathString = hidePoint
      ? this.getTree().getPointPathString(hidePoint)
      : this.pathStringThrough();

    this.lineThroughMe = this.lineThroughMe || this.getTree()._R.path(pathString);

    var line_style = this.util.cloneObj(this.connStyle.style);

    delete line_style["arrow-start"];
    delete line_style["arrow-end"];

    this.lineThroughMe.attr(line_style);

    if (hidePoint) {
      this.lineThroughMe.hide();
      this.lineThroughMe.hidden = true;
    }
  }

  addSwitchEvent(nodeSwitch: any) {
    var self = this;
    this.util.addEvent(nodeSwitch, "click", function (e: any) {
      e.preventDefault();
      if (
        self
          .getTreeConfig()
          .callback.onBeforeClickCollapseSwitch.apply(self, [nodeSwitch, e]) ===
        false
      ) {
        return false;
      }

      self.toggleCollapse();

      self
        .getTreeConfig()
        .callback.onAfterClickCollapseSwitch.apply(self, [nodeSwitch, e]);
    });
  }

  /**
   * @returns {TreeNode}
   */
  collapse() {
    if (!this.collapsed) {
      this.toggleCollapse();
    }
    return this;
  }

  /**
   * @returns {TreeNode}
   */
  expand() {
    if (this.collapsed) {
      this.toggleCollapse();
    }
    return this;
  }

  /**
   * @returns {TreeNode}
   */
  toggleCollapse() {
    console.log(`toggleCollapse begin`);
    const oTree = this.getTree();
    console.log('oTree');
    console.log(oTree);

    if (!oTree.inAnimation) {
      oTree.inAnimation = true;

      this.collapsed = !this.collapsed; // toggle the collapse at each click
      this.util.toggleClass(this.nodeDOM, "collapsed", this.collapsed);

      oTree.positionTree();

      var self = this;

      setTimeout(
        (oTree) => {
          // set the flag after the animation
          oTree.inAnimation = false;
          oTree.CONFIG.callback.onToggleCollapseFinished.apply(oTree, [
            self,
            self.collapsed,
          ]);
        },
        oTree.CONFIG.animation.nodeSpeed >
          oTree.CONFIG.animation.connectorsSpeed
          ? oTree.CONFIG.animation.nodeSpeed
          : oTree.CONFIG.animation.connectorsSpeed
        , oTree
      );
    }
    console.log(`toggleCollapse end`);
    return this;
  }

  hide(collapse_to_point: any) {
    collapse_to_point = collapse_to_point || false;

    var bCurrentState = this.hidden;
    this.hidden = true;

    this.nodeDOM.style.overflow = "hidden";

    var tree = this.getTree(),
      config = this.getTreeConfig(),
      oNewState: any = {
        opacity: 0,
      };

    if (collapse_to_point) {
      oNewState.left = collapse_to_point.x;
      oNewState.top = collapse_to_point.y;
    }

    // if parent was hidden in initial configuration, position the node behind the parent without animations
    if (!this.positioned || bCurrentState) {
      this.nodeDOM.style.visibility = "hidden";
      if ($) {
        $(this.nodeDOM).css(oNewState);
      } else {
        this.nodeDOM.style.left = oNewState.left + "px";
        this.nodeDOM.style.top = oNewState.top + "px";
      }
      this.positioned = true;
    } else {
      // todo: fix flashy bug when a node is manually hidden and tree.redraw is called.
      if ($) {
        $(this.nodeDOM).animate(
          oNewState,
          config.animation.nodeSpeed,
          config.animation.nodeAnimation,
          function () {
            this.style.visibility = "hidden";
          }
        );
      } else {
        this.nodeDOM.style.transition =
          "all " + config.animation.nodeSpeed + "ms ease";
        this.nodeDOM.style.transitionProperty = "opacity, left, top";
        this.nodeDOM.style.opacity = oNewState.opacity;
        this.nodeDOM.style.left = oNewState.left + "px";
        this.nodeDOM.style.top = oNewState.top + "px";
        this.nodeDOM.style.visibility = "hidden";
      }
    }

    // animate the line through node if the line exists
    if (this.lineThroughMe) {
      var new_path = tree.getPointPathString(collapse_to_point);
      if (bCurrentState) {
        // update without animations
        this.lineThroughMe.attr({ path: new_path });
      } else {
        // update with animations
        tree.animatePath(
          this.lineThroughMe,
          tree.getPointPathString(collapse_to_point)
        );
      }
    }

    return this;
  }

  /**
   * @returns {TreeNode}
   */
  hideConnector() {
    // console.log('hideConnector begin');
    var oTree = this.getTree();
    var oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 0 },
        oTree.CONFIG.animation.connectorsSpeed,
        oTree.CONFIG.animation.connectorsAnimation
      );
    }
    // console.log('hideConnector end');
    return this;
  }

  show() {
    this.hidden = false;

    this.nodeDOM.style.visibility = "visible";

    var oTree = this.getTree();

    var oNewState = {
      left: this.X,
      top: this.Y,
      opacity: 1,
    };
    const config = this.getTreeConfig();

    // // if the node was hidden, update opacity and position
    if ($) {
      $(this.nodeDOM).animate(
        oNewState,
        config.animation.nodeSpeed,
        config.animation.nodeAnimation,
        function () {
          // $.animate applies "overflow:hidden" to the node, remove it to avoid visual problems
          this.style.overflow = "";
        }
      );
    } else {
      this.nodeDOM.style.transition =
        "all " + config.animation.nodeSpeed + "ms ease";
      this.nodeDOM.style.transitionProperty = "opacity, left, top";
      this.nodeDOM.style.left = oNewState.left + "px";
      this.nodeDOM.style.top = oNewState.top + "px";
      this.nodeDOM.style.opacity = oNewState.opacity;
      this.nodeDOM.style.overflow = "";
    }

    if (this.lineThroughMe) {
      this.getTree().animatePath(this.lineThroughMe, this.pathStringThrough());
    }

    return this;
  }

  /**
   * @returns {TreeNode}
   */
  showConnector() {
    // console.log(`showConnector begin`);
    var oTree = this.getTree();
    var oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 1 },
        oTree.CONFIG.animation.connectorsSpeed,
        oTree.CONFIG.animation.connectorsAnimation
      );
    }
    // console.log(`showConnector end`);
    return this;
  }

  /**
   * Build a node from the 'text' and 'img' property and return with it.
   *
   * The node will contain all the fields that present under the 'text' property
   * Each field will refer to a css class with name defined as node-{$property_name}
   *
   * Example:
   * The definition:
   *
   *   text: {
   *     desc: "some description",
   *     paragraph: "some text"
   *   }
   *
   * will generate the following elements:
   *
   *   <p class="node-desc">some description</p>
   *   <p class="node-paragraph">some text</p>
   *
   * @Returns the configured node
   */
  buildNodeFromText(node: any) {
    // IMAGE
    if (this.image) {
      const image = document.createElement("img");
      image.src = this.image;
      node.appendChild(image);
    }

    // TEXT
    if (this.text) {
      for (var key in this.text) {
        // adding DATA Attributes to the node
        if (key.startsWith("data-")) {
          node.setAttribute(key, this.text[key]);
        } else {
          var textElement = document.createElement(
            this.text[key].href ? "a" : "p"
          ) as HTMLAnchorElement;

          // make an <a> element if required
          if (this.text[key].href) {
            textElement.href = this.text[key].href;
            if (this.text[key].target) {
              textElement.target = this.text[key].target;
            }
          }

          textElement.className = "node-" + key;
          textElement.appendChild(
            document.createTextNode(
              this.text[key].val
                ? this.text[key].val
                : this.text[key] instanceof Object
                  ? "'val' param missing!"
                  : this.text[key]
            )
          );

          node.appendChild(textElement);
        }
      }
    }
    return node;
  }

  /**
   * Build a node from  'nodeInnerHTML' property that defines an existing HTML element, referenced by it's id, e.g: #someElement
   * Change the text in the passed node to 'Wrong ID selector' if the referenced element does ot exist,
   * return with a cloned and configured node otherwise
   *
   * @Returns node the configured node
   */
  buildNodeFromHtml(node: any) {
    // get some element by ID and clone its structure into a node
    if (this.nodeInnerHTML.charAt(0) === "#") {
      var elem = document.getElementById(this.nodeInnerHTML.substring(1));
      if (elem) {
        node = elem.cloneNode(true);
        node.id += "-clone";
        node.className += " node";
      } else {
        node.innerHTML = "<b> Wrong ID selector </b>";
      }
    } else {
      // insert your custom HTML into a node
      node.innerHTML = this.nodeInnerHTML;
    }
    return node;
  }

  /**
   * @param {Tree} tree
   */
  createGeometry(tree: any) {
    // console.log('createGeometry begin');
    if (this.id === 0 && tree.CONFIG.hideRootNode) {
      this.width = 0;
      this.height = 0;
      return;
    }

    var drawArea = tree.drawArea,
      image;
    /////////// CREATE NODE //////////////
    let node: any = document.createElement(this.link.href ? "a" : "div");

    node.className = !this.pseudo ? this.CONFIG.nodeHTMLclass : "pseudo";
    if (this.nodeHTMLclass && !this.pseudo) {
      node.className += " " + this.nodeHTMLclass;
    }

    if (this.nodeHTMLid) {
      node.id = this.nodeHTMLid ?? this.id;
    }

    if (this.link.href) {
      node.href = this.link.href;
      node.target = this.link.target;
    }

    if ($) {
      $(node).data("treenode", this);
    } else {
      node.data = {
        treenode: this,
      };
    }

    /////////// BUILD NODE CONTENT //////////////
    if (!this.pseudo) {
      node = this.nodeInnerHTML
        ? this.buildNodeFromHtml(node)
        : this.buildNodeFromText(node);

      // handle collapse switch
      if (
        this.collapsed ||
        (this.collapsable && this.childrenCount() && !this.stackParentId)
      ) {
        this.createSwitchGeometry(tree, node);
      }
    }

    tree.CONFIG.callback.onCreateNode.apply(tree, [this, node]);

    /////////// APPEND all //////////////
    drawArea.appendChild(node);

    // console.log(`node`);
    // console.log(node);

    // console.log(`node.offsetHeight ${node.offsetHeight}`);
    // console.log(`node.offsetWidth ${node.offsetWidth}`);

    this.width = node.offsetWidth;
    this.height = node.offsetHeight;

    this.nodeDOM = node;

    tree.imageLoader.processNode(this);
    // console.log('createGeometry end');
  }

  /**
   * @param {Tree} tree
   * @param {Element} nodeEl
   */
  createSwitchGeometry(tree: any, nodeEl: any) {
    nodeEl = nodeEl || this.nodeDOM;

    // safe guard and check to see if it has a collapse switch
    var nodeSwitchEl = this.util.findEl(".collapse-switch", true, nodeEl);
    if (!nodeSwitchEl) {
      nodeSwitchEl = document.createElement("a");
      nodeSwitchEl.className = "collapse-switch";

      nodeEl.appendChild(nodeSwitchEl);
      this.addSwitchEvent(nodeSwitchEl);
      if (this.collapsed) {
        nodeEl.className += " collapsed";
      }

      tree.CONFIG.callback.onCreateNodeCollapseSwitch.apply(tree, [
        this,
        nodeEl,
        nodeSwitchEl,
      ]);
    }
    return nodeSwitchEl;
  }
}
