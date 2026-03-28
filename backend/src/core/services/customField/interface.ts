export interface CreateCustomFieldBody {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'file';
    required?: boolean;
    description?: string;
}

export interface UpdateCustomFieldBody {
    label?: string;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'file';
    required?: boolean;
    description?: string;
}
