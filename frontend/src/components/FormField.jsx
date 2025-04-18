import {InputGroup, Col, Form} from 'react-bootstrap';

function FormField({field, setField, type, id, label, inputGroupPrefix, inputGroupSuffix, errors})
{
    let inputGroupPrefixElement=inputGroupPrefix?(<InputGroup.Text>{inputGroupPrefix}</InputGroup.Text>):null;
    let inputGroupSuffixElement = inputGroupSuffix?(<InputGroup.Text>{inputGroupSuffix}</InputGroup.Text>):null;

    let errorElement = null;
    if(errors)
    {
        const errorElements = [];
        for(let error of errors)
        {
            errorElements.push(<li>{error}</li>);
        }
        errorElement = <Form.Control.Feedback type="invalid"><ul>
            {errorElements}
        </ul></Form.Control.Feedback>;
    }

    const formControl = type ==='textarea'?<Form.Control id={id} required as="textarea" value={field} onChange={(e) => {
        let value = e.target.value;
        setField(value);
    }}/>:<Form.Control id={id} required type={type?type:"text"} value={field} onChange={(e) => {
        let value = e.target.value;
        setField(value);
    }}/>;


    return(
        <Form.Group as={Col}>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <InputGroup>
                {inputGroupPrefixElement}
                {formControl}
                {inputGroupSuffixElement}
            </InputGroup>
            {errorElement}
        </Form.Group>
    );

}

export default FormField;