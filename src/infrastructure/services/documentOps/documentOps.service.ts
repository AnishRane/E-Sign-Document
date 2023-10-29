import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { error } from 'console';
import * as FormData from 'form-data';

interface RecipientInfo {
  name: string;
  email: string;
}

@Injectable()
export class DocumentOpsService {
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

    const actions = [];
    for (let i = 0; i < recipients.length; i++) {
      const action = {
        recipient_name: recipients[i].name,
        recipient_email: recipients[i].email,
        action_type: 'SIGN',
        private_notes: 'Please get back to us for further queries',
        signing_order: i + 1,
        verify_recipient: false,
        verification_type: 'EMAIL',
        verification_code: '',
      };
      actions.push(action);
    }

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
        const submitForm = new FormData();
        const actions = response.data.requests.actions.map((action) => {
          delete action.action_status;
          delete action.allow_signing;
          return action;
        });
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
      throw new Error('Something went wrong');
    }
  }
}
