const tempEngine = (template: string, data: Record<string, any>): string => {
  //regular expression for detecting out template tags
  const reg: RegExp = /<%([^%>]+)?%>/g;
  //regular expession for detecting conditions and loops
  const reExp: RegExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  //initial code variable wrapped in a string
  let code: string = "var r=[];\n";
  //cursor variable used to navigate through out html
  let cursor: number = 0;
  //match variable used in the loop
  let match: RegExpExecArray | null;
  //add function that appends html chunks to the code variable in a js syntax
  const add = (html: string, js: boolean): void => {
    //code checks if chunl has conditions or loops and appends it to code in a js syntax
    js
      ? (code += html.match(reExp) ? html + "\n" : `r.push(${html});\n`)
      : (code += `r.push("${html.replace(/"/g, '\\"')}");\n`);
  };
  //loop generates html chunks that are passed to the add function
  while ((match = reg.exec(template))) {
    //gets chunk from its beginning to where our template synyacts starts
    add(template.slice(cursor, match.index), false);
    add(match[1], true);
    //updates the  cursor so it can move to the next chunk
    cursor = match.index + match[0].length;
  }

  add(template.substr(cursor, template.length - cursor), false);
  //joins the contents of code together and returns it, making it actual executable code
  code += 'return r.join("");';
  console.log(code);
  //allows code to be exceutable
  return new Function(code.replace(/[\r\t\n]/g, "")).apply(data);
};

const temp: string = `hello my name is <%this.name%>, i am
   <%for(let x in this.age){%>
      <%x%>
  <%}%>
    years old`;

console.log(
  tempEngine(temp, {
    name: "feranmi",
    age: [20, 10, 30],
  })
);
