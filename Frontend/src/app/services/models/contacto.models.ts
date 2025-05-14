// Defines the structure for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  improvementDescription?: string;
  isNotRobot: boolean;
}

// Defines the input structure for the AI message improvement service
export interface ImproveMessageInput {
  originalMessage: string;
  improvementDescription: string;
}

// Defines the output structure from the AI message improvement service
export interface ImproveMessageOutput {
  improvedMessage: string;
}

// Defines the structure for API responses from the contact service
export interface ApiResponse {
  success: boolean;
  message: string;
}
