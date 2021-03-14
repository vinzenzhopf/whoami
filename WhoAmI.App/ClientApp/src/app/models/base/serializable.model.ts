export class Serializable {
  fromJSON(json): this {
      // tslint:disable-next-line:forin
      for (const propName in json) {
          this[propName] = json[propName];
      }
      return this;
  }
}
