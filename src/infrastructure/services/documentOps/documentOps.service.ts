import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';

interface RecipientInfo {
  name: string;
  email: string;
}

@Injectable()
export class DocumentOpsService {
  generateActions(recipients: RecipientInfo[], numFiles: number) {
    const actions = [];
    for (let i = 0; i < numFiles; i++) {
      recipients.forEach((recipient) => {
        const action = {
          recipient_name: recipient.name,
          recipient_email: recipient.email,
          action_type: 'SIGN',
          private_notes: 'Please get back to us for further queries',
          signing_order: 0,
          verify_recipient: true,
          verification_type: 'EMAIL',
          verification_code: '',
        };
        actions.push(action);
      });
    }
    return actions;
  }

  async createAndSubmitDocument(
    recipients: RecipientInfo[],
    files: Express.Multer.File[],
    zohoToken: string,
  ) {
    const headers = { Authorization: 'Zoho-oauthtoken ' + zohoToken };
    const formData = new FormData();

    files['documents'].forEach((file) => {
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    const actions = this.generateActions(recipients, files['documents'].length);

    const docJson = {
      requests: {
        request_name: 'NDA ',
        actions,
        expiration_days: 10,
        is_sequential: true,
        email_reminders: true,
        reminder_period: 8,
      },
    };

    formData.append('data', JSON.stringify(docJson));
    try {
      const response: AxiosResponse = await axios.post(
        'https://sign.zoho.in/api/v1/requests',
        formData,
        { headers: { ...formData.getHeaders(), ...headers } },
      );

      if (response.data.status === 'success') {
        const request_id = response.data.requests.request_id;
        const actions = response.data.requests.actions;
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          if (action.action_type === 'SIGN') {
            const fields = [];
            const documents = response.data.requests.document_ids;
            for (let j = 0; j < documents.length; j++) {
              const document_id = documents[j].document_id;
              const sigField = {
                field_type_name: 'Signature',
                is_mandatory: true,
                field_name: 'Signature',
                page_no: 0,
                y_coord: 669,
                abs_width: 150,
                description_tooltip: '',
                x_coord: 72,
                abs_height: 20,
                document_id: document_id,
              };
              fields.push(sigField);
            }
            action.fields = fields;
            delete action.allow_signing;
            delete action.action_status;
          }
        }

        const submitForm = new FormData();
        submitForm.append('data', JSON.stringify({ requests: { actions } }));

        const submitResponse: AxiosResponse = await axios.post(
          `https://sign.zoho.in/api/v1/requests/${request_id}/submit`,
          submitForm,
          { headers: { ...submitForm.getHeaders(), ...headers } },
        );
        if (submitResponse.data.status === 'success') {
          return submitResponse.data.status;
        } else {
          throw new Error('Error: ' + submitResponse.data.message);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
