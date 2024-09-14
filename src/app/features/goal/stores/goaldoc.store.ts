import { computed, inject } from '@angular/core';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
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
    isLoading: boolean;
};

const initialState: GoalState = {
    id: 0,
    goals: new Array<Goaldoc>(),
    isLoading: false,
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
        getGoals: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() => {
                    return goalService.getGoals().pipe(
                        tapResponse({
                            next: (goals: Array<Goaldoc>) => {
                                console.log(goals)
                                patchState(store, { goals })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        // saveGoaldoc: rxMethod<Goaldoc>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((goaldoc: Goaldoc) => {
        //             return goaldocService.putGoaldoc(goaldoc).pipe(
        //                 tapResponse({
        //                     next: (res: Goaldoc) => {
        //                         patchState(store, { goaldoc: goaldoc })
        //                         // replace updated goaldoc
        //                         patchState(store, (state: any) => ({ goaldoc: state.goaldocs.splice(state.goaldocs.findIndex((item: Goaldoc) => goaldoc.id == item.id), 1, goaldoc) }))
        //                         if (goaldoc.id)
        //                             goaldocService.getGoaldocById(goaldoc.id)
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // ),
        // addGoaldoc: rxMethod<any>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((goaldoc: Goaldoc) => {
        //             return goaldocService.postGoaldoc(goaldoc).pipe(
        //                 tapResponse({
        //                     next: (res: Goaldoc) => {
        //                         store.goaldocs().push(res)
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // ),
        // deleteGoaldoc: rxMethod<number>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((id) => {
        //             return goaldocService.deleteGoaldoc(id).pipe(
        //                 tapResponse({
        //                     next: (res: any) => {
        //                         // remove deleted from store
        //                         patchState(store, (state: any) => ({ goaldocs: state.goaldocs.filter((goaldoc: Goaldoc) => goaldoc.id !== id) }))
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // )
    }))
);