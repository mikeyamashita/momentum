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
import { Goal } from '../models/goal';
import { Goaldoc } from '../models/goaldoc';

type GoalState = {
    id: number,
    goals: Array<Goaldoc>;
    habitMatrix: Array<any>;
    isLoading: boolean;
    isSaving: boolean
};

const initialState: GoalState = {
    id: 0,
    goals: new Array<Goaldoc>(),
    habitMatrix: new Array<any>(),
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
    withMethods((store, goalService = inject(GoalService)) => ({
        setGoaldocId(goaldocid: number): void {
            patchState(store, { id: goaldocid });
        },
        // initializeHabitMatrix(): void {
        //     let matchdata = new Array<any>()
        //     let start = new Date("01/01/" + '2024');
        //     let end = new Date("12/31/" + '2024');

        //     let loop = new Date(start);
        //     while (loop <= end) {
        //       let stringData = goalService.format(loop)

        //       matchdata.push([stringData, 0])

        //       var newDate = loop.setDate(loop.getDate() + 1);
        //       loop = new Date(newDate);
        //     }
        //     // console.log(this.matchdata)
        //     patchState(store, { habitMatrix: matchdata })
        // },
        getGoals: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                concatMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                // goals.sort((a, b) => a?.id - b?.id)
                                patchState(store, { goals })
                                patchState(store, { habitMatrix: goalService.getProgress(goals) })
                                console.log(store.habitMatrix())
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
                            next: () => {
                                // patchState(store, { goals: goaldoc })
                                // replace updated goaldoc
                                // let goalsDup = store.goals()
                                // console.log(store.goals().findIndex((item: Goaldoc) => goaldoc.id == item.id))
                                // console.log(store.goals().splice(store.goals().findIndex((item: Goaldoc) => goaldoc.id == item.id), 1, goaldoc))
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
                                patchState(store, { habitMatrix: goalService.getProgress(goals) })
                                console.log(store.habitMatrix())
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