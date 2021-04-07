// styles
import './inputgroup.scss';

export const InputGroup = ({ onChange, data }) => {
    const { label, input } = data;

    return (
        <div className='input-group'>
            <label style={label.style} htmlFor={input.name}>
                {input.placeholder}
            </label>
            <input
                value={input.value}
                onChange={onChange}
                style={input.style}
                type={input.type}
                name={input.name}
                id={input.name}
                placeholder={input.placeholder}
            />
        </div>
    );
};
