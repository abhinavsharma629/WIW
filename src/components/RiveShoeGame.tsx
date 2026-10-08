"use client";

import { useEffect, useRef } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";

type Role = "bride" | "groom";
type Shoe = Role | null;
type Result = "correct" | "incorrect" | null;

const RIVE_FILE = "/animations/wedding-shoe-game.riv";
const WEDDING_ARTBOARD = "Wedding Shoe Game";

export const weddingRiveContract = {
  stateMachine: "Wedding Shoe Game",
  triggers: {
    ask: "ask",
    bridePickup: "bridePickup",
    groomPickup: "groomPickup",
    raiseBrideShoe: "raiseBrideShoe",
    raiseGroomShoe: "raiseGroomShoe",
    correct: "correct",
    incorrect: "incorrect",
    reset: "reset",
  },
  values: {
    questionIndex: "questionIndex",
    selectedSide: "selectedSide",
    selectedShoe: "selectedShoe",
  },
} as const;

function WeddingRiveCanvas({
  guestSide,
  raisedShoe,
  questionNumber,
  compact = false,
}: {
  guestSide: Role;
  raisedShoe: Shoe;
  questionNumber: number;
  compact?: boolean;
}) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_FILE,
    artboard: WEDDING_ARTBOARD,
    stateMachines: weddingRiveContract.stateMachine,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const viewModel = useViewModel(rive, { useDefault: true });
  const viewModelInstance = useViewModelInstance(viewModel, {
    useDefault: true,
    rive,
  });

  const { trigger: ask } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.ask,
    viewModelInstance,
  );
  const { trigger: bridePickup } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.bridePickup,
    viewModelInstance,
  );
  const { trigger: groomPickup } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.groomPickup,
    viewModelInstance,
  );
  const { trigger: raiseBrideShoe } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.raiseBrideShoe,
    viewModelInstance,
  );
  const { trigger: raiseGroomShoe } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.raiseGroomShoe,
    viewModelInstance,
  );
  const { trigger: reset } = useViewModelInstanceTrigger(
    weddingRiveContract.triggers.reset,
    viewModelInstance,
  );

  const { setValue: setQuestionIndex } = useViewModelInstanceNumber(
    weddingRiveContract.values.questionIndex,
    viewModelInstance,
  );
  const { setValue: setSelectedSide } = useViewModelInstanceNumber(
    weddingRiveContract.values.selectedSide,
    viewModelInstance,
  );
  const { setValue: setSelectedShoe } = useViewModelInstanceNumber(
    weddingRiveContract.values.selectedShoe,
    viewModelInstance,
  );

  useEffect(() => {
    setQuestionIndex(questionNumber - 1);
    setSelectedSide(guestSide === "bride" ? 0 : 1);
  }, [guestSide, questionNumber, setQuestionIndex, setSelectedSide]);

  useEffect(() => {
    reset();
    const timer = window.setTimeout(ask, 80);
    return () => window.clearTimeout(timer);
  }, [ask, questionNumber, reset]);

  useEffect(() => {
    if (!raisedShoe) {
      return;
    }

    setSelectedShoe(raisedShoe === "bride" ? 0 : 1);
    if (guestSide === "bride") {
      bridePickup();
    } else {
      groomPickup();
    }

    if (raisedShoe === "bride") {
      raiseBrideShoe();
    } else {
      raiseGroomShoe();
    }
  }, [
    bridePickup,
    groomPickup,
    guestSide,
    raiseBrideShoe,
    raiseGroomShoe,
    raisedShoe,
    setSelectedShoe,
  ]);

  return (
    <div
      className={`wedding-rive-canvas ${compact ? "is-compact" : ""}`}
      role="img"
      aria-label={
        compact
          ? `${guestSide} wedding game character preview`
          : "Animated bride, groom, host, decorated wedding stage, and cheering guests"
      }
    >
      <RiveComponent />
    </div>
  );
}

export function RiveCharacterPreview({ role }: { role: Role }) {
  return (
    <WeddingRiveCanvas
      guestSide={role}
      raisedShoe={null}
      questionNumber={1}
      compact
    />
  );
}

export function RiveShoeGameStage({
  guestSide,
  raisedShoe,
  result,
  question,
  questionNumber,
  totalQuestions,
  onPickupComplete,
}: {
  guestSide: Role;
  raisedShoe: Shoe;
  result: Result;
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onPickupComplete: () => void;
}) {
  const completionRef = useRef(onPickupComplete);

  useEffect(() => {
    completionRef.current = onPickupComplete;
  }, [onPickupComplete]);

  useEffect(() => {
    if (!raisedShoe) {
      return;
    }

    const timer = window.setTimeout(() => completionRef.current(), 1_600);
    return () => window.clearTimeout(timer);
  }, [guestSide, raisedShoe]);

  return (
    <div
      className={`rive-wedding-stage ${result === "correct" ? "is-celebrating" : ""}`}
    >
      <WeddingRiveCanvas
        guestSide={guestSide}
        raisedShoe={raisedShoe}
        questionNumber={questionNumber}
      />
      <div className="rive-question-board">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <strong>{question}</strong>
      </div>
      <div className="rive-side-indicator" aria-live="polite">
        Playing as the {guestSide}
      </div>
    </div>
  );
}
