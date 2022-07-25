import React, { useId } from 'react';
import { FormCheck } from 'react-bootstrap';
import { CommandSpecType } from './command-spec-type';

export const CommandSpecTypeRadioGroupComponent: React.FC<{
  commandSpecType: string;
  radioGroupName: string;
  typeChangedFn: (newType: string) => void;
}> = (props) => {
  const id1 = useId();
  const id2 = useId();

  const radioButtonData = [
    { id: id1, type: CommandSpecType.Enum.VARIABLE },
    { id: id2, type: CommandSpecType.Enum.ROLE_KEY },
  ];
  return (
    <div role="radiogroup" aria-label={props.radioGroupName}>
      {radioButtonData.map((d) => (
        <FormCheck
          inline
          label={d.type}
          type="radio"
          role="radio"
          id={d.id}
          key={d.type}
          checked={props.commandSpecType === d.type}
          onChange={(_e) => props.typeChangedFn(d.type)}
        />
      ))}
    </div>
  );
};
