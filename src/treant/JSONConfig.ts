// #############################################
// Makes a JSON chart config out of Array config
// #############################################

import { injectable } from "inversify";
import { ChartStructure } from "./Treant";

@injectable()
export class JSONconfig {
  private json_id = 1;
  private jsonStructure: ChartStructure;

  make(configArray: any) {
    var i = configArray.length,
      node;

    this.jsonStructure = {
      chart: null,
      nodeStructure: null,
    };
    //fist loop: find config, find root;
    while (i--) {
      node = configArray[i];
      if (node.hasOwnProperty("container")) {
        this.jsonStructure.chart = node;
        continue;
      }

      if (!node.hasOwnProperty("parent") && !node.hasOwnProperty("container")) {
        this.jsonStructure.nodeStructure = node;
        node._json_id = 0;
      }
    }

    this.findChildren(configArray);

    return this.jsonStructure;
  }

  findChildren(nodes: any) {
    var parents = [0]; // start with a a root node

    while (parents.length) {
      const parentId: number = parents.pop() as number;
      const parent = this.findNode(this.jsonStructure.nodeStructure, parentId);
      var i = 0,
        len = nodes.length,
        children = [];

      for (; i < len; i++) {
        var node = nodes[i];
        if (node.parent && node.parent._json_id === parentId) {
          // skip config and root nodes

          node._json_id = this.getID();

          delete node.parent;

          children.push(node);
          parents.push(node._json_id);
        }
      }

      if (children.length) {
        parent.children = children;
      }
    }
  }

  findNode(node: any, nodeId: number): any {
    var childrenLen, found;

    if (node._json_id === nodeId) {
      return node;
    } else if (node.children) {
      childrenLen = node.children.length;
      while (childrenLen--) {
        found = this.findNode(node.children[childrenLen], nodeId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  getID() {
    return this.json_id++;
  }
}
