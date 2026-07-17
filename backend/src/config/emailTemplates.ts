import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export class EmailTemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }

  private registerHelpers() {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      return new Date(date).toLocaleDateString();
    });

    Handlebars.registerHelper('eq', (a: any, b: any) => {
      return a === b;
    });
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, '../templates/emails');

    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir);
      files.forEach((file) => {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
          this.templates.set(templateName, Handlebars.compile(templateContent));
        }
      });
    }
  }

  render(templateName: string, data: Record<string, unknown>): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }
    return template(data);
  }
}

export const emailTemplateService = new EmailTemplateService();
