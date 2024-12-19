export interface TaskModel {
  title: Title2;
  link: Link2;
  project: Project;
  description: Description2;
  environment: Environment;
  key: Key;
  summary: Summary;
  type: Type;
  priority: Priority;
  status: Status;
  statusCategory: StatusCategory;
  resolution: Resolution;
  assignee: Assignee;
  reporter: Reporter;
  labels: Labels;
  created: Created;
  updated: updated;
  component: Component;
  due: Due;
  votes: Votes;
  watches: Watches;
  comments: Comments;
  issuelinks: Issuelinks;
  attachments: Attachments;
  subtasks: Subtasks;
  customfields: Customfields;
}

export interface Title2 {
  _text: string;
}

export interface Link2 {
  _text: string;
}

export interface Project {
  _attributes: Attributes2;
  _text: string;
}

export interface Attributes2 {
  id: string;
  key: string;
}

export interface Description2 {
  p: P[];
  hr: Hr;
}

export interface P {
  _text: any;
  br?: Br;
  b?: B;
  tt: any;
  a?: A;
}

export interface Br {}

export interface B {
  _text: string;
}

export interface A {
  _attributes: Attributes3;
  _text: string;
}

export interface Attributes3 {
  href: string;
  title: string;
  class: string;
  rel: string;
}

export interface Hr {}

export interface Environment {}

export interface Key {
  _attributes: Attributes4;
  _text: string;
}

export interface Attributes4 {
  id: string;
}

export interface Summary {
  _text: string;
}

export interface Type {
  _attributes: Attributes5;
  _text: string;
}

export interface Attributes5 {
  id: string;
  iconUrl: string;
}

export interface Priority {
  _attributes: Attributes6;
  _text: string;
}

export interface Attributes6 {
  id: string;
  iconUrl: string;
}

export interface Status {
  _attributes: Attributes7;
  _text: string;
}

export interface Attributes7 {
  id: string;
  iconUrl: string;
  description: string;
}

export interface StatusCategory {
  _attributes: Attributes8;
}

export interface Attributes8 {
  id: string;
  key: string;
  colorName: string;
}

export interface Resolution {
  _attributes: Attributes9;
  _text: string;
}

export interface Attributes9 {
  id: string;
}

export interface Assignee {
  _attributes: Attributes10;
  _text: string;
}

export interface Attributes10 {
  accountid: string;
}

export interface Reporter {
  _attributes: Attributes11;
  _text: string;
}

export interface Attributes11 {
  accountid: string;
}

export interface Labels {}

export interface Created {
  _text: string;
}

export interface updated {
  _text: string;
}

export interface Component {
  _text: string;
}

export interface Due {}

export interface Votes {
  _text: string;
}

export interface Watches {
  _text: string;
}

export interface Comments {
  comment: Comment[];
}

export interface Comment {
  _attributes: Attributes12;
  p: any;
  ul?: Ul;
}

export interface Attributes12 {
  id: string;
  author: string;
  created: string;
}

export interface Ul {
  li: Li[];
}

export interface Li {
  _text: any;
  font?: Font;
  ol?: Ol;
  ul?: Ul2;
  br?: Br4[];
}

export interface Font {
  _attributes: Attributes13;
  _text: string;
}

export interface Attributes13 {
  color: string;
}

export interface Ol {
  li: Li2[];
}

export interface Li2 {
  _text: any;
  font?: Font2;
  br?: Br2;
}

export interface Font2 {
  _attributes: Attributes14;
  _text: string;
}

export interface Attributes14 {
  color: string;
}

export interface Br2 {}

export interface Ul2 {
  li: Li3[];
}

export interface Li3 {
  _text: any;
  br?: Br3;
  a?: A2;
}

export interface Br3 {}

export interface A2 {
  _attributes: Attributes15;
  _text: string;
}

export interface Attributes15 {
  href: string;
  title: string;
  class: string;
  rel: string;
}

export interface Br4 {}

export interface Issuelinks {
  issuelinktype: Issuelinktype[];
}

export interface Issuelinktype {
  _attributes: Attributes16;
  name: Name;
  inwardlinks: Inwardlinks;
}

export interface Attributes16 {
  id: string;
}

export interface Name {
  _text: string;
}

export interface Inwardlinks {
  _attributes: Attributes17;
  issuelink: any;
}

export interface Attributes17 {
  description: string;
}

export interface Attachments {}

export interface Subtasks {
  subtask: Subtask[];
}

export interface Subtask {
  _attributes: Attributes18;
  _text: string;
}

export interface Attributes18 {
  id: string;
}

export interface Customfields {
  customfield: Customfield[];
}

export interface Customfield {
  _attributes: Attributes19;
  customfieldname: Customfieldname;
  customfieldvalues: Customfieldvalues;
}

export interface Attributes19 {
  id: string;
  key: string;
}

export interface Customfieldname {
  _text: string;
}

export interface Customfieldvalues {
  customfieldvalue?: Customfieldvalue;
}

export interface Customfieldvalue {
  _text?: string;
  _attributes?: Attributes20;
}

export interface Attributes20 {
  id?: string;
  key?: string;
}
