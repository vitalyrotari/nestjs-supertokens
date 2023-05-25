import * as mjml2html from 'mjml';
import { readFileSync } from 'node:fs';
import { compile, TemplateDelegate } from 'handlebars';

export class EmailDeliverViewService<T = unknown> {
  private hbTemplate: TemplateDelegate;

  constructor(public readonly templateFile: string) {}

  getContentBody(input: T): string {
    if (!this.hbTemplate) {
      this.compileTemplate();
    }

    return this.hbTemplate({ ...input });
  }

  protected compileTemplate() {
    const filePath = `emails/templates/${this.templateFile}`;
    const mjmlResult = mjml2html(readFileSync(filePath).toString());

    if (mjmlResult.errors.length > 0) {
      throw new Error(
        `Could not parse mjml file "${filePath}": ${JSON.stringify(
          mjmlResult.errors,
          undefined,
          2,
        )}`,
      );
    }

    this.hbTemplate = compile(mjmlResult.html);
  }
}
