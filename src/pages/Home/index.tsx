import { Play } from 'phosphor-react';
import { useState } from 'react';
import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	TaskInput,
} from './styles';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const newCicleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod.number().min(5).max(60),
});

export function Home() {
	const { register, handleSubmit, watch } = useForm({
		resolver: zodResolver(newCicleFormValidationSchema),
	});

	function handleCreateNewCicle(data: any) {
		console.log(data);
	}

	const task = watch('task');
	const isSubmitDisabled = !task;

	return (
		<HomeContainer>
			<form
				onSubmit={handleSubmit(handleCreateNewCicle)}
				action=""
			>
				<FormContainer>
					<label htmlFor="task">Vou trabalhar em</label>
					<TaskInput
						type="text"
						id="task"
						placeholder="Dê um nome para o seu projeto"
						list="task-suggestions"
						{...register('task')}
					/>

					<datalist id="task-suggestions">
						<option value="Banana"></option>
						<option value="Maçã"></option>
					</datalist>

					<label htmlFor="minutesAmmount">durante</label>
					<MinutesAmountInput
						type="number"
						id="minutesAmmount"
						placeholder="00"
						step="5"
						min="5"
						// max="60"
						{...register('minutesAmount', { valueAsNumber: true })}
					/>
					<span>minutos.</span>
				</FormContainer>

				<CountdownContainer>
					<span>0</span>
					<span>0</span>
					<Separator>:</Separator>
					<span>0</span>
					<span>0</span>
				</CountdownContainer>

				<StartCountdownButton
					disabled={isSubmitDisabled}
					type="submit"
				>
					<Play />
					Começar
				</StartCountdownButton>
			</form>
		</HomeContainer>
	);
}
