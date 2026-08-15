export namespace Antonius {
  export interface Article {
    name: string;
    active: boolean;
    tax: number;
    supplier: Supplier;
    categories: string[];
    mainDetail: MainDetail;
    descriptionLong: string;
    propertyValues: PropertyValue[];
    procurable: boolean;
    modificationDate: string;
  }

  export interface ArticleReturn {
    meta: MetaReturn;
    articles: Article[];
  }

  export interface Attribute {
    attributename: string;
    attributevalue: string;
  }

  export interface Category {
    id: string;
    name: string;
    parent: string;
    active: string;
    hausliste: boolean;
    modificationDate: string;
  }

  // export CategoryReturn {}

  export interface Error {
    code: number;
    message: string;
    fields: string;
  }

  export interface MainDetail {
    number: string;
    prices: Price[];
    unit: Unit;
    purchaseUnit: string;
    purchasePrice: number;
    packUnit: string;
    referenceUnit: string;
    attribute: Attribute[];
  }

  export interface MetaReturn {
    skip: number;
    take: number;
    since: string;
    total: number;
    debugInfos?: string;
  }

  export interface Price {
    groupKey: string;
    from: number;
    to: number;
    price: number;
    pseudoprice: number;
    baseprice: number;
  }

  export interface PropertyValue {
    option: string;
    value: string;
  }

  export interface Supplier {
    Key_ADR: number;
    Firmenname: string;
  }

  export enum Unit {
    Zentimeter = "cm",
    Flasche = "Fl",
    Gramm = "g",
    InternationaleEinheiten = "IE",
    Kilogramm = "kg",
    Liter = "l",
    Meter = "m",
    Milligramm = "mg",
    Milliliter = "ml",
    Millimeter = "mm",
    Packung = "P",
    Spruehstoesse = "Sp",
    Stueck = "St",
    Mikrogramm = "µg",
  }

  export enum PriceGroupKey {
    VerkaufsPreis = "EK",
    AbgabepreisUnternemer = "ApU",
    Apothekeneinkaufspreis = "Apo_Ek",
    Apothekenverkaufspreis = "Apo_Vk",
    UnverbindlichePreisempfehlung = "UVP",
  }
}