import { computed, inject } from '@angular/core';
import { concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { GoalService } from '../services/goal.service';
import { Goaldoc } from '../models/goaldoc';
import { HabitGridService } from '../../habitgrid/services/habitgrid.service';

type GoalState = {
    id: number,
    goal: Goaldoc,
    goals: Array<Goaldoc>;
    isLoading: boolean;
    isSaving: boolean
};

const initialState: GoalState = {
    id: 0,
    goal: new Goaldoc(),
    goals: new Array<Goaldoc>(),
    isLoading: false,
    isSaving: false
};

export const GoaldocStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ goals }) => ({
        goaldocsCount: computed(() => goals().length),
        goaldocsList: computed(() => goals())
    })),
    withMethods((store, goalService = inject(GoalService), habitService = inject(HabitGridService)) => ({
        setGoaldocId(goaldocid: number): void {
            patchState(store, { id: goaldocid });
        },
        getGoalById: rxMethod<number>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                concatMap((id) => {
                    return goalService.getGoalById(id).pipe(
                        tapResponse({
                            next: (goal: Goaldoc) => {
                                console.log(goal)
                                patchState(store, { goal })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        getGoals: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                concatMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                // habitService.rebuildHabitMatrix(goals, 2024)
                                patchState(store, { goals })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        saveGoaldoc: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isSaving: true })),
                concatMap((goaldoc: Goaldoc) => {
                    return goalService.putGoaldoc(goaldoc).pipe(
                        tapResponse({
                            next: (goal) => {
                                // patchState(store, { goal })
                            },
                            error: console.error
                        })
                    );
                }),
                concatMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                patchState(store, { goals })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isSaving: false }),
                        })
                    );
                })
            )
        ),
        addGoaldoc: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((goaldoc: Goaldoc) => {
                    return goalService.postGoaldoc(goaldoc).pipe(
                        tapResponse({
                            next: (res: Goaldoc) => {
                                store.goals().push(res)
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                }),
                concatMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                patchState(store, { goals })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isSaving: false }),
                        })
                    );
                })
            )
        ),
        deleteGoaldoc: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((id) => {
                    return goalService.deleteGoaldoc(id).pipe(
                        tapResponse({
                            next: (res: any) => {
                                // remove deleted from store
                                patchState(store, (state: any) => ({ goals: state.goals.filter((goal: Goaldoc) => goal.id !== id) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        )
    }))
);