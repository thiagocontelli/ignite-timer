import { Play, HandPalm } from 'phosphor-react';
import { createContext, useState } from 'react';
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CyclesContextType {
	activeCycle: Cycle | undefined;
	activeCycleId: string | null;
	markCurrentCycleAsFinished: () => void;
	amountSecondsPassed: number;
	setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(5, 'Informe a tarefa'),
	minutesAmount: zod.number().min(1).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
	
	const newCycleForm = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		},
	});
	
	const { handleSubmit, watch, reset } = newCycleForm
	const task = watch('task');
	const isSubmitDisabled = !task;


	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, finishedDate: new Date() };
				}

				return cycle;
			})
		);
	}

	function handleCreateNewCycle(data: NewCycleFormData) {
		const newCycle: Cycle = {
			id: String(new Date().getTime()),
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		setActiveCycleId(newCycle.id);
		setCycles((prevState) => [...prevState, newCycle]);
		setAmountSecondsPassed(0);

		reset();
	}

	function handleInterruptCycle() {
		setActiveCycleId(null);
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() };
				}

				return cycle;
			})
		);

		setActiveCycleId(null);
	}

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

	return (
		<HomeContainer>
			<form
				onSubmit={handleSubmit(handleCreateNewCycle)}
				action=""
			>
				<CyclesContext.Provider 
					value={{ 
						activeCycle,
						activeCycleId,
						markCurrentCycleAsFinished,
						amountSecondsPassed,
						setSecondsPassed
					}}>
					<FormProvider {...newCycleForm}>
						<NewCycleForm />
					</FormProvider>
					<Countdown />
				</CyclesContext.Provider>

				{activeCycle ? (
					<StopCountdownButton
						onClick={handleInterruptCycle}
						type="submit"
					>
						<HandPalm />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton
						disabled={isSubmitDisabled}
						type="submit"
					>
						<Play />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
