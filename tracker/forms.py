from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

from .models import JobApplication


class DateInput(forms.DateInput):
    input_type = 'date'


class StyledFormMixin:
    def apply_shared_styles(self):
        for field_name, field in self.fields.items():
            widget = field.widget
            existing_class = widget.attrs.get('class', '')
            widget.attrs['class'] = f"{existing_class} form-control".strip()

            if isinstance(widget, forms.Textarea):
                widget.attrs.setdefault('placeholder', f'Enter {field.label.lower()}')
            elif isinstance(widget, (forms.TextInput, forms.EmailInput, forms.URLInput, forms.NumberInput)):
                widget.attrs.setdefault('placeholder', f'Enter {field.label.lower()}')


class LoginForm(StyledFormMixin, AuthenticationForm):
    error_messages = {
        'invalid_login': 'Account not found. Please create your account first and then log in.',
        'inactive': 'This account is inactive.',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'placeholder': 'Enter your username',
            'autocomplete': 'off',
            'autocapitalize': 'none',
            'spellcheck': 'false',
        })
        self.fields['password'].widget.attrs.update({
            'placeholder': 'Enter your password',
            'autocomplete': 'new-password',
        })
        self.apply_shared_styles()


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Choose a username'})
        self.fields['email'].widget.attrs.update({'placeholder': 'Enter your email'})
        self.fields['password1'].widget.attrs.update({'placeholder': 'Create a password'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm your password'})
        StyledFormMixin.apply_shared_styles(self)


class JobApplicationForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = JobApplication
        exclude = ('user', 'created_at', 'updated_at')
        widgets = {
            'date_applied': DateInput(),
            'last_contacted_on': DateInput(),
            'follow_up_date': DateInput(),
            'notes': forms.Textarea(attrs={'rows': 5}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['company_name'].widget.attrs['placeholder'] = 'Enter company name'
        self.fields['role'].widget.attrs['placeholder'] = 'Enter role or internship title'
        self.fields['location'].widget.attrs['placeholder'] = 'Enter job location'
        self.fields['salary_range'].widget.attrs['placeholder'] = 'Example: 6-8 LPA'
        self.fields['source'].widget.attrs['placeholder'] = 'LinkedIn, campus drive, referral, careers page'
        self.fields['application_link'].widget.attrs['placeholder'] = 'Paste the job or internship link'
        self.fields['contact_name'].widget.attrs['placeholder'] = 'Enter recruiter or contact name'
        self.fields['contact_email'].widget.attrs['placeholder'] = 'Enter contact email'
        self.fields['resume_version'].widget.attrs['placeholder'] = 'Example: Resume v3'
        self.fields['next_step'].widget.attrs['placeholder'] = 'Example: Prepare for interview round'
        self.fields['notes'].widget.attrs['placeholder'] = 'Add notes about the role, process, or preparation'
        self.apply_shared_styles()
